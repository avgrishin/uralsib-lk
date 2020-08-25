<?php namespace Rs\Smev3\Components\Soap;

class Client extends \SoapClient
{
    protected $request;

    protected function setLastRequest($request)
    {
        $this->__last_request = $request;
        return $this;
    }

	protected function setLastResponse($response)
	{
		$this->__last_response = $response;
		return $this;
	}

    protected function getTypeRequest()
    {
        return $this->request;
    }

    /**
     * @param mixed $request
     */
    public function setTypeRequest($request)
    {
        $this->request = $request;
    }

    public function __construct($wsdl, array $options = null)
    {
        if (!is_array($options) || empty($options)) {
            $options = array(
                'soap_version' => SOAP_1_1,
                'exceptions' => true,
                'trace' => true,
                'cache_wsdl' => WSDL_CACHE_NONE,
                'stream_context' => stream_context_create(array(
                    "ssl" => array(
                        "verify_peer" => false,
                        "allow_self_signed" => true
                    )
                ))
            );
        }

        parent::__construct($wsdl, $options);
    }

    public function __doRequest($request, $location, $action, $version, $one_way = 0)
    {
        $request = $this->getTypeRequest()->prepareSoapRequest($request);
        $this->setLastRequest($request);

        $response = parent::__doRequest($request, $location, $action, $version, $one_way);

        return $this->getTypeRequest()->prepareSoapResponse($response);
    }


}