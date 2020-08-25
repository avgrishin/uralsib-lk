<?php namespace Rs\Smev3\TypeRequest;

use Rs\Smev3\Components\Database\Db;
use Rs\Smev3\Components\GEN_UUID;
use Rs\Smev3\Env;

class SendRequest extends Base
{
    protected $needToSign = true;
    protected $nodeToSign = 'SenderProvidedRequestData';
    protected $signContainer = 'SendRequestRequest';
    protected $name = 'SendRequest';

    protected $messageContent;
    protected $messageContainer = 'MessagePrimaryContent';

    protected function getMessageContent()
    {
        return $this->getTypeInfo()->createMessage();
    }

    protected function getMessageContainer()
    {
        return $this->messageContainer;
    }

    protected function setBody($request)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($request);

        $message = $dom->createDocumentFragment();
        $message->appendXML($this->getMessageContent());

        $body = $dom->getElementsByTagName($this->getMessageContainer())->item(0);
        $body->appendChild($message);

        return $dom->saveXML($dom->documentElement);
    }

    protected function createMessage()
    {
        $message = new \StdClass();
        $message->SenderProvidedRequestData = new \StdClass();
        $message->SenderProvidedRequestData->MessageID = $this->getMessageId();
        $message->SenderProvidedRequestData->MessagePrimaryContent = '';
        if ($this->getEnv()->getMode() === Env::$TEST) {
            //$message->SenderProvidedRequestData->TestMessage = '';
        }

        return $message;
    }

    protected function responseIsDone($response)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($response);

        $status = $dom
            ->getElementsByTagName('MessageMetadata')->item(0)
            ->getElementsByTagName('Status')->item(0);

        return ($status->textContent === 'requestIsQueued');
    }

    protected function handleResponseDone($response)
    {
        return ['state' => +$this->responseIsDone($response)];
    }

    public function prepareSoapRequest($request)
    {
        $request = $this->setBody($request);
        if ($this->isNeedToSign()) {
            $request = $this->setSign($request);
        }

        return $request;
    }

    public function sendSoap()
    {
        $status = 'fail';
        $error = '';
        try {
            $soap = $this->createSoap();
        }
        catch (\Exception $e) {
            $response = $this->handleResponseException('', $e);
            return $response;
        }
        try {
            $soap->__call($this->getName(), [$this->createMessage()]);
            $status = 'done';
            $response = $this->handleResponseDone($soap->__getLastResponse());
        } catch (\SoapFault $e) {
            $response = $this->handleResponseFail($soap->__getLastResponse(), $e);
            $error = $e->getMessage();
        } catch (\Exception $e) {
            $response = $this->handleResponseException($soap->__getLastResponse(), $e);
            $error = $e->getMessage();
        }

        $storage = Db::getInstance();
        try {
            $response['request_message_id'] = $this->getMessageId();
            $storage->insert('smev_request', [
                'uuid' => $response['request_message_id'],
                'timestamp' => $this->getTimestamp(),
                'name' => $this->getName(),
                'content' => $soap->__getLastRequest(),
                'response' => $soap->__getLastResponse(),
                'is_success' => (1 === $response['state']),
                'error_message' => ($e ? $e->getMessage() : '')
            ]);

			$time = time();
			$storage->insert('smev_queue', [
				'request_message_id' => $response['request_message_id'],
				'is_valid' => rand(0,1),
				'created_at' => $time,
				'updated_at' => $time,
				'request_id' => $time,
			]);
        }
        catch (\Exception  $e) {
            dd('db error',0);
            dd($e->getMessage(),0);
        }

        file_put_contents($_SERVER['DOCUMENT_ROOT'].'/send.xml', date('d.m.Y H:i:s'). ', ' . $status . ', ' . $error ."\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'].'/send.xml', $soap->__getLastRequest()."\n\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'].'/send.xml', $soap->__getLastResponse()."\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'].'/send.xml', date('--------------------------')."\n\n", FILE_APPEND);

        return $response;
    }

	public function doDummyRequest($request)
	{
		$response = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
						<SOAP-ENV:Body>
							<DummyResponse>
								<MessageMetadata><Status>requestIsQueued</Status></MessageMetadata>
							</DummyResponse>
						</SOAP-ENV:Body>
    				</SOAP-ENV:Envelope>';

		$dom = new \DOMDocument();
		$dom->loadXML($response);

		return $dom->saveXML($dom->documentElement);
	}
}