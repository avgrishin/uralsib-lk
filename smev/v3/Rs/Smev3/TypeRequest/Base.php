<?php namespace Rs\Smev3\TypeRequest;

use Rs\Smev3\Components\Database\Db;
use Rs\Smev3\Components\GEN_UUID;

abstract class Base
{
    protected $TypeInfo;
    protected $Env;
    protected $Signer;

    protected $messageId;
    protected $needToSign;
    protected $nodeToSign;
    protected $signContainer;
    protected $name;
    protected $messageTimeFormat = 'Y-m-d\\TH:i:s.uP';

    protected function getMessageId()
    {
        return $this->messageId;
    }

    protected function setMessageId($messageId)
    {
        $this->messageId = $messageId;
    }

    protected function getName()
    {
        return $this->name;
    }

    protected function isNeedToSign()
    {
        return $this->needToSign;
    }

    protected function getNodeToSign()
    {
        return $this->nodeToSign;
    }

    protected function getSignContainer()
    {
        return $this->signContainer;
    }

    protected function setSign($request)
    {
        $signer = $this->createSigner();
        $request = $signer->sign($request, $this->getSignContainer(), $this->getNodeToSign());

        return $request;
    }

    protected function createSoap()
    {
        $Soap = new \Rs\Smev3\Components\Soap\ClientDummy($this->getEnv()->getUrl());
        $Soap->setTypeRequest($this);

        return $Soap;
    }

    protected function handleResponseFail($response, \SoapFault $e)
    {
        return ['state' => 0, 'message' => $e->getMessage()];
    }

    protected function handleResponseException($response, \Exception $e)
    {
        return ['state' => 0, 'message' => $e->getMessage()];
    }

    protected function getNodeDummy()
    {
        return mt_rand(0, 0xffff) . mt_rand(0, 0xffff) . mt_rand(0, 0xffff);
    }

    protected function getTimestamp()
    {
        $now = \DateTime::createFromFormat('U.u', microtime(true));
        $now->setTimezone(new \DateTimeZone(date_default_timezone_get()));

        return $now->format($this->messageTimeFormat);
    }

    public function __construct()
    {
        $this->setMessageId(GEN_UUID::generate(GEN_UUID::UUID_TIME, GEN_UUID::FMT_STRING, $this->getNodeDummy()));
    }

	/**
	 * @param bool $needToSign
	 */
	public function setNeedToSign($needToSign)
	{
		$this->needToSign = $needToSign;
	}

    /**
     * @return mixed
     */
    public function getTypeInfo()
    {
        return $this->TypeInfo;
    }

    /**
     * @param $TypeInfo
     * @return $this
     */
    public function setTypeInfo($TypeInfo)
    {
        $this->TypeInfo = $TypeInfo;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEnv()
    {
        return $this->Env;
    }

    /**
     * @param $Env
     * @return $this
     */
    public function setEnv($Env)
    {
        $this->Env = $Env;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSigner()
    {
        return $this->Signer;
    }

    /**
     * @param mixed $Signer
     */
    public function setSigner($Signer)
    {
        $this->Signer = $Signer;
    }

    public function createSigner()
    {
        return $this->getEnv()->getSigner();
    }

    public function prepareSoapResponse($response)
    {
        return $response;
    }

    public function getStorage()
    {
        return Db::getInstance();
    }
}