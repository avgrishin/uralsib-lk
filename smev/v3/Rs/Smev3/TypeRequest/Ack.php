<?php namespace Rs\Smev3\TypeRequest;

use Rs\Smev3\Components\Database\Db;

class Ack extends Base
{
    protected $needToSign = true;
    protected $signContainer = 'AckRequest';
    protected $nodeToSign = 'AckTargetMessage';
    protected $messageContainer = 'MessageTypeSelector';

    protected $name = 'Ack';
    protected $messageId;
    protected $messageAck;
    protected $messageContent;

    protected $messageTimeFormat = 'Y-m-d\\TH:i:s.uP';

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
        $dom = new \DOMDocument();
        $dom->loadXML($request);

        $message = $dom->getElementsByTagName('AckTargetMessage')->item(0);
        $message->setAttribute('accepted', 'true');

        return $dom->saveXML($dom->documentElement);
    }

    protected function getTimestamp()
    {
        $now = \DateTime::createFromFormat('U.u', microtime(true));
        $now->setTimezone(new \DateTimeZone(date_default_timezone_get()));

        return $now->format($this->messageTimeFormat);
    }

    protected function getNotAcked()
    {
        $storage = $this->getStorage();
        return $storage->get('queue', 'is_acked', 0);
    }

    /**
     * @return mixed
     */
    protected function getMessageAck()
    {
        return $this->messageAck;
    }

    /**
     * @param mixed $messageAck
     */
    protected function setMessageAck($messageAck)
    {
        $this->messageAck = $messageAck;
    }

    public function findMessageToAck()
    {
        $notAcked = $this->getNotAcked();
        if ($notAcked) {
            $this->setMessageAck($notAcked);
        }

        return !!$notAcked;
    }

    protected function createMessage()
    {
        $message = new \StdClass();
        $message->AckTargetMessage = $this->getMessageAck()['response_message_id'];

        return $message;
    }

    protected function handleResponseDone($response)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($response);

        $message = $dom->getElementsByTagName('AckResponse')->item(0);
        $isSuccess = ('' === trim($message->textContent));

        return ['state' => +$isSuccess];
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
        return $response;
    }

    public function sendSoap()
    {
        try {
            $soap = $this->createSoap();
        }
        catch (\Exception $e) {
            $response = $this->handleResponseException('', $e);
            return $response;
        }
        $status = 'fail';
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
            $storage->insert('request', [
                'uuid' => $this->getMessageId(),
                'timestamp' => $this->getTimestamp(),
                'name' => $this->getName(),
                'content' => $soap->__getLastRequest(),
                'response' => str_replace('\'', '', $soap->__getLastResponse()),
                'is_success' => (1 === $response['state']),
                'error_message' => ($e ? $e->getMessage() : '')
            ]);

            if (1 === $response['state']) {
                $response['request_message_id'] = $this->getMessageAck()['request_message_id'];
                $response['response_message_id'] = $this->getMessageAck()['response_message_id'];
                $storage->update('queue', $this->getMessageAck()['id'], [
                    'is_acked' => 1,
                    'updated_at' => time()
                ]);
            }
        }
        catch (\Exception  $e) {
            dd('db error',0);
            dd($e->getMessage(),0);
        }

        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ack.xml',
            date('d.m.Y H:i:s') . ', ' . $status . ', ' . $error . "\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ack.xml', $soap->__getLastRequest() . "\n\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ack.xml', $soap->__getLastResponse() . "\n", FILE_APPEND);
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ack.xml', date('--------------------------') . "\n\n",
            FILE_APPEND);

        return $response;
    }
}