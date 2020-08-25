<?php namespace Rs\Smev3\TypeInfo;


/**
 * Request
 * <tns:ESIADataVerifyRequest xmlns:tns="urn://mincomsvyaz/esia/uprid/1.4.0" xmlns:ns2="urn://mincomsvyaz/esia/commons/rg_sevices_types/1.4.0">
 * <tns:RoutingCode>DEV</tns:RoutingCode>
 * <tns:passportSeries>{{passportSeries}}</tns:passportSeries>
 * <tns:passportNumber>{{passportNumber}}</tns:passportNumber>
 * <tns:lastName>{{lastName}}</tns:lastName>
 * <tns:firstName>{{firstName}}</tns:firstName>
 * <tns:middleName>{{middleName}}</tns:middleName>
 * <tns:snils>{{snils}}</tns:snils>
 * </tns:ESIADataVerifyRequest>
 *
 * Response
 * <tns:ESIADataVerifyResponse xmlns:tns="urn://mincomsvyaz/esia/uprid/1.4.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:ns2="urn://mincomsvyaz/esia/commons/rg_sevices_types/1.4.0">
 * <tns:status>VALID</tns:status>
 * <tns:requestId>1115335</tns:requestId>
 * </tns:ESIADataVerifyResponse>
 *
 * Class ESIADataVerifyRequest
 * @package Rs\Smev3\TypeInfo
 */
class ESIADataVerify extends Base
{
    protected static $EnvCodes = [
        'prod' => 'PROD'
    ];
    protected $fieldNS = 'tns';
    protected $UriNS = 'urn://mincomsvyaz/esia/uprid/1.4.0';
    protected $name = 'ESIADataVerifyRequest';
    protected $ns = [
        'xmlns:tns' => 'urn://mincomsvyaz/esia/uprid/1.4.0',
    ];

    protected $fields = [
        'passportSeries' => [
            'name' => 'Passport series',
            'regexp' => '/^\d{4}$/',
            'hints' => [
                //'regexp' => '/^\d{4}$/'
            ]
        ],
        'passportNumber' => [
            'name' => 'Passport number',
            'regexp' => '/^\d{6}$/',
            'hints' => [
                //'regexp' => '/^\d{6}$/'
            ]
        ],
        'lastName' => [],
        'firstName' => [],
        'middleName' => [
            'required' => false
        ],
        'snils' => [
            'regexp' => '/^\d{3}-\d{3}-\d{3} \d{2}$/'
        ],
        'inn' => [
            'regexp' => '/^\d{12}$/'
        ],
    ];

    protected function beforeSetBody(&$out)
    {
        $out[] = '<' . $this->fieldNS . ':RoutingCode>' . $this->getRoutingCode() . '</' . $this->fieldNS . ':RoutingCode>';
    }

    protected function getRoutingCode()
    {
        $mode = $this->getEnv()->getMode();
        if (array_key_exists($mode, self::$EnvCodes)) {
            return self::$EnvCodes[$mode];
        }

        return 'DEV';
    }

    public function __construct($data = [])
    {
        if (is_array($data) && !empty($data)) {
            $this->setFields($data);
        }
    }

    public function createFilter()
    {
        $message = new \StdClass();
        $message->NamespaceURI = $this->UriNS;
        $message->RootElementLocalName = $this->name;

        return $message;
    }

    public function handleResponseDone($response)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($response);

        $status = '';
        $response = $dom->getElementsByTagName('ESIADataVerifyResponse')->item(0);
        if ($response) {
            $status = trim($response->getElementsByTagName('status')->item(0)->textContent);
        }

        $isSuccess = ('valid' === mb_strtolower($status));
        $requestIdNode = $response->getElementsByTagName('requestId')->item(0);
        $result['state'] = +$isSuccess;
        if ($requestIdNode) {
            $result['requestId'] = trim($requestIdNode->textContent);
        }

        return $result;
    }

}