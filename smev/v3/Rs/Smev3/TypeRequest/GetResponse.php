<?php namespace Rs\Smev3\TypeRequest;

use Rs\Smev3\Components\Database\Db;
use Rs\Smev3\Components\GEN_UUID;

class GetResponse extends Base
{
	protected $needToSign = true;
	protected $signContainer = 'GetResponseRequest';
	protected $nodeToSign = 'MessageTypeSelector';
	protected $messageContainer = 'MessageTypeSelector';

	protected $name = 'GetResponse';
	protected $messageId;
	protected $messageContent;

	protected function getMessageContent()
	{
		return $this->getTypeInfo()->createFilter();
	}

	protected function getMessageContainer()
	{
		return $this->messageContainer;
	}

	protected function setBody($request)
	{
		return $request;
	}

	protected function createMessage()
	{
		$message = new \StdClass();
		$message->MessageTypeSelector = $this->getMessageContent();
		$message->MessageTypeSelector->Timestamp = $this->getTimestamp();

		return $message;
	}

	protected function responseIsDone($response)
	{
		$dom = new \DOMDocument();
		$dom->loadXML($response);

		$status = $dom
			->getElementsByTagName('MessageMetadata')->item(0)
			->getElementsByTagName('Status')->item(0);

		return ($status->textContent === 'responseIsDelivered');
	}

	protected function responseGetFault($response)
	{
		$dom = new \DOMDocument();
		$dom->loadXML($response);

		$error = false;
		$data = $dom->getElementsByTagName('SenderProvidedResponseData')->item(0);
		if ($data) {
			$fault = $data->getElementsByTagName('AsyncProcessingStatus')->item(0);
			if ($fault) {
				$faultCode = trim($fault->getElementsByTagName('StatusCategory')->item(0)->textContent);
				$faultMessage = trim($fault->getElementsByTagName('StatusDetails')->item(0)->textContent);
				$validErrors = $fault->getElementsByTagName('ValidationError');
				foreach ($validErrors as $f) {
					$faultMessage .= "\n" . trim($f->textContent);
				}

				$error = new \SoapFault($faultCode, $faultMessage);
			}
		}

		return $error;
	}

	protected function cutMTOMResponse($response)
	{
		$start = stripos($response, '<soap:Envelope');
		$end = stripos($response, '</soap:Envelope>');

		return substr($response, $start, $end - $start + 1 + strlen('</soap:Envelope>'));
	}

	protected function isEmptyResponse($response)
	{
		$dom = new \DOMDocument();
		$dom->loadXML($response);

		$node = $dom->getElementsByTagName('GetResponseResponse')->item(0);
		return !trim($node->nodeValue);
	}

	protected function handleResponseDone($response)
	{
		if ($isEmpty = $this->isEmptyResponse($response)) {
			return ['state' => 1, 'message' => 'queue is empty'];
		}

		return $this->getTypeInfo()->handleResponseDone($response);
	}

	public function prepareSoapRequest($request)
	{
		$request = $this->setBody($request);
		if ($this->isNeedToSign()) {
			$request = $this->setSign($request);
		}

		return $request;
	}

	public function prepareSoapResponse($response)
	{
		//$response = $this->cutMTOMResponse($response);

		return $response;
	}

	public function sendSoap()
	{
		try {
			$soap = $this->createSoap();
		} catch (\Exception $e) {
			$response = $this->handleResponseException('', $e);
			return $response;
		}
		try {
			$soap->__call($this->getName(), [$this->createMessage()]);
			$error = $this->responseGetFault($soap->__getLastResponse());
			if (!$error) {
				$status = 'done';
				$response = $this->handleResponseDone($soap->__getLastResponse());
			} else {
				throw $error;
			}
		} catch (\SoapFault $e) {
			$response = $this->handleResponseFail($soap->__getLastResponse(), $e);
			$error = $e->getMessage();
		} catch (\Exception $e) {
			$response = $this->handleResponseException($soap->__getLastResponse(), $e);
			$error = $e->getMessage();
		}

		$storage = Db::getInstance();
		try {
			$dom = new \DOMDocument();
			$dom->loadXML($soap->__getLastResponse());

			$requestMessageId = trim($dom->getElementsByTagName('OriginalMessageId')->item(0)->textContent);
			$responseMessageId = trim($dom->getElementsByTagName('MessageID')->item(0)->textContent);
			$isValid = (bool)+$response['state'];

			$d = Db::getInstance()->get('smev_queue', 'request_message_id', $requestMessageId, true);
			if (0 && !$d && $requestMessageId && $responseMessageId) {
				$time = time();
				$storage->insert('smev_queue', [
					'request_message_id' => $requestMessageId,
					'response_message_id' => $responseMessageId,
					'is_valid' => $isValid,
					'created_at' => $time,
					'updated_at' => $time,
				]);
				$response['request_message_id'] = $requestMessageId;
				$response['response_message_id'] = $responseMessageId;
			}

			$storage->insert('smev_request', [
				'uuid' => $this->getMessageId(),
				'timestamp' => $this->getTimestamp(),
				'name' => $this->getName(),
				'content' => $soap->__getLastRequest(),
				'response' => str_replace('\'', '', $soap->__getLastResponse()),
				'is_success' => (1 === $response['state']),
				'error_message' => str_replace('\'', '', ($e ? $e->getMessage() : ''))
			]);
		} catch (\Exception  $e) {
			dd('db error', 0);
			dd($e->getMessage(), 0);
		}

		file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/get.xml',
			date('d.m.Y H:i:s') . ', ' . $status . ', ' . $error . "\n", FILE_APPEND);
		file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/get.xml', $soap->__getLastRequest() . "\n\n", FILE_APPEND);
		file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/get.xml', $soap->__getLastResponse() . "\n", FILE_APPEND);
		file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/get.xml', date('--------------------------') . "\n\n",
			FILE_APPEND);

		return $response;
	}

	public function doDummyRequest($request)
	{
		$dom = new \DOMDocument();
		$dom->loadXML($request);
		$requestMessageId = trim($dom->getElementsByTagName('OriginalMessageId')->item(0)->textContent);

		$d = Db::getInstance()->get('smev_queue', 'request_message_id', $requestMessageId, true);
		if (is_array($d) && !empty($d)) {
			$isValid = $d['is_valid'];
			$requestId = $d['request_id'];
			$response = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
						<SOAP-ENV:Body>
							<DummyResponse>
								<GetResponseResponse>
									<OriginalMessageId>' . $requestMessageId . '</OriginalMessageId>
									<MessageID>' . GEN_UUID::generate(GEN_UUID::UUID_TIME, GEN_UUID::FMT_STRING,
					$this->getNodeDummy()) . '</MessageID>
									<ESIADataVerifyResponse>
										<status>' . ($isValid ? 'valid' : 'invalid') . '</status>									
										<requestId>' . $requestId . '</requestId>									
									</ESIADataVerifyResponse>
								</GetResponseResponse>
							</DummyResponse>
						</SOAP-ENV:Body>
    				</SOAP-ENV:Envelope>';
		} else {
			$response = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
						<SOAP-ENV:Body>
							<DummyResponse>
								<GetResponseResponse>
									<SenderProvidedResponseData>
										<AsyncProcessingStatus>
											<StatusCategory>400</StatusCategory>
											<StatusDetails>' . $requestMessageId . ' not found' . '</StatusDetails>
										</AsyncProcessingStatus>
									</SenderProvidedResponseData>
									<OriginalMessageId>' . $requestMessageId . '</OriginalMessageId>
									<MessageID>' . GEN_UUID::generate(GEN_UUID::UUID_TIME, GEN_UUID::FMT_STRING,
					$this->getNodeDummy()) . '</MessageID>
								</GetResponseResponse>
							</DummyResponse>
						</SOAP-ENV:Body>
    				</SOAP-ENV:Envelope>';
		}

		return $response;
	}
}