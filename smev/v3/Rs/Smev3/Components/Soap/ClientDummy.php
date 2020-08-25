<?php namespace Rs\Smev3\Components\Soap;

class ClientDummy extends Client
{
	protected $request;

	public function __doRequest($request, $location, $action, $version, $one_way = 0)
	{
		$request = $this->getTypeRequest()->prepareSoapRequest($request);
		$this->setLastRequest($request);

		try {
			$response = $this->getTypeRequest()->doDummyRequest($request);
			$this->setLastResponse($response);
		}
		catch (\Exception $e) {
			throw new \Exception($e->getMessage(), $e->getCode());
		}

		return $this->getTypeRequest()->prepareSoapResponse($response);
	}
}