<?php namespace Rs\Smev3\Components\Signer\XMLDSigSigner;

class CryptoPro
{
    private $config;
    private $configPath;

    private $cryptcp;
    private $csptest;
    private $openssl;

    private $dirFiles;
    private $digestFile;
    private $digestFileHashExtension = 'hsh';
    private $signatureFile;
    private $x509CertFile;
    private $x509PublicKeyFile;

    private $algoHash;
    private $shellEncode;

    private $certContainerName;
    private $certContainerPswd;

    private $signatureTemplate = '<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411"/><ds:Reference URI="#SIGNED_BY_CONSUMER"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:Transform Algorithm="urn://smev-gov-ru/xmldsig/transform"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#gostr3411"/><ds:DigestValue></ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue></ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate></ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature>';


    public function __construct($configPath)
    {
        $this->configPath = $configPath;
        $this->setAndLoadConfig();
        $this->setFilesPaths();
    }

    /**
     * Shell command for sign
     *
     * @param $configPath
     * @return $this
     */
    protected function setAndLoadConfig()
    {
        $config = require $this->configPath;
        $this->config = $config;

        $this->cryptcp = $config['cryptcp'];
        $this->csptest = $config['csptest'];
        $this->openssl = $config['openssl'];

        $this->algoHash = $config['algoHash'];
        $this->shellEncode = $config['shellEncode'];

        $this->dirFiles = $config['folder'];

        $this->x509CertFile = $config['x509CertFile'];
        $this->x509PublicKeyFile = $config['x509PublicKeyFile'];

        $this->certContainerName = file_get_contents($config['certContainerName']);
        $this->certContainerPswd = file_get_contents($config['certContainerPswd']);

        return $this;
    }

    protected function setFilesPaths()
    {
        $this->digestFile = $this->dirFiles . '/digest.xml';
        $this->signatureFile = $this->dirFiles . '/signature.xml';
    }

    private function transformXmlData($data)
    {
        $in = new \DOMDocument('1.0', 'UTF-8');
        $in->loadXML($data);

        $out = new \XMLWriter();
        $out->openMemory();

        $index = 0;
        $stack = [null, [$in->documentElement, []]];
        while (count($stack)) {
            $item = array_pop($stack);
            if ($item === null) {
                $out->text('');
                $out->endElement();
                continue;
            }
            $node = $item[0];
            $nsList = $item[1];
            if ($node->nodeType == XML_ELEMENT_NODE) {
                // Let the magic begin! ;)
                // The element itself.
                if ($node->namespaceURI !== null) {
                    $thisLevel = false;
                    if (($nsList[$node->namespaceURI] ?: null) === null) {
                        $thisLevel = true;
                        $nsList[$node->namespaceURI] = 'ns' . ++$index;
                    }
                    $out->startElement("{$nsList[$node->namespaceURI]}:{$node->localName}");
                    if ($thisLevel) {
                        $out->writeAttribute("xmlns:{$nsList[$node->namespaceURI]}", $node->namespaceURI);
                    }
                } else {
                    $out->startElement($node->localName);
                }
                // Attributes.
                $attrs = iterator_to_array($node->attributes);
                usort($attrs, function ($a, $b) {
                    if ($a->namespaceURI !== null && $b->namespaceURI === null) {
                        return -1;
                    } else {
                        if ($a->namespaceURI === null && $b->namespaceURI !== null) {
                            return 1;
                        } else {
                            return strcmp($a->namespaceURI, $b->namespaceURI) ?: strcmp($a->localName, $b->localName);
                        }
                    }
                });
                foreach ($attrs as $attr) {
                    if ($attr->namespaceURI !== null && ($nsList[$attr->namespaceURI] ?: null) === null) {
                        $nsList[$attr->namespaceURI] = 'ns' . ++$index;
                        $out->writeAttribute("xmlns:{$nsList[$attr->namespaceURI]}", $attr->namespaceURI);
                    }
                }
                foreach ($attrs as $attr) {
                    if ($attr->namespaceURI !== null) {
                        $out->writeAttribute("{$nsList[$attr->namespaceURI]}:{$attr->localName}", $attr->nodeValue);
                    } else {
                        $out->writeAttribute($attr->localName, $attr->nodeValue);
                    }
                }
            } else {
                if ($node->nodeType == XML_TEXT_NODE && strlen(trim($node->nodeValue))) {
                    $out->text($node->nodeValue);
                }
            }

            if ($node->lastChild !== null) {
                $stack[] = null;
                for ($node = $node->lastChild; $node !== null; $node = $node->previousSibling) {
                    $stack[] = [$node, $nsList];
                }
            }
        }

        return $out->outputMemory();
    }

    public function makeDigest($request, $nodeName)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($request);

        $node = $dom->getElementsByTagName($nodeName)->item(0);
        $data = $node->C14N(true, false);
        $data = $this->transformXmlData($data);
        file_put_contents($this->digestFile, $data);
        $command = $this->cryptcp . ' -hash -hashAlg ' . $this->algoHash . ' -dir ' . dirname($this->digestFile) . ' ' . $this->digestFile;
        exec($command, $output, $returnVar);
        if (0 !== $returnVar) {
            dd($command,0);
            dd($output,0);
            throw new \Exception(__FILE__ . ' ' . __LINE__);
        }

        $fileHash = $this->digestFile . '.' . $this->digestFileHashExtension;
        $dataHash = file_get_contents($fileHash);
        //unlink($fileHash);

        return base64_encode($dataHash);
    }

    public function makeSign($request, $nodeName)
    {
        $dom = new \DOMDocument();
        $dom->loadXML($request);

        $node = $dom->getElementsByTagName($nodeName)->item(0);
        $data = $node->C14N(true, false);
        file_put_contents($this->signatureFile, $data);

        $certContainerName = iconv('UTF-8', $this->shellEncode, $this->certContainerName);
        $command = $this->csptest . ' -keys -cont "' . $certContainerName . '" -sign GOST94_256 -in ' . $this->signatureFile . ' -out ' . $this->signatureFile . '.' . $this->digestFileHashExtension . ' -password "' . $this->certContainerPswd . '" -keytype exchange -expcert ' . $this->x509CertFile;
        exec($command, $output, $returnVar);
        if (0 !== $returnVar) {
            dd($command,0);
            dd($output,0);
            throw new \Exception(__FILE__ . ' ' . __LINE__);
        }

        //$command = $this->openssl . ' x509 -in ' . $this->x509CertFile . ' -inform DER -engine gost -pubkey -noout > ' . $this->x509PublicKeyFile;
        //exec($command, $output, $returnVar);
        if (0 && 0 !== $returnVar) {
            dd($command,0);
            dd($output,0);
            throw new \Exception(__FILE__ . ' ' . __LINE__);
        }

        $fileHash = $this->signatureFile . '.' . $this->digestFileHashExtension;
        $dataHash = strrev(file_get_contents($fileHash));
        //unlink($fileHash);

        return base64_encode($dataHash);
    }

    public function makeCert()
    {
        return base64_encode(file_get_contents($this->x509CertFile));
    }

    public function getSignatureTemplate()
    {
        return $this->signatureTemplate;
    }

    public function sign($request, $signContainer, $nodeToSign)
    {
        if (!is_dir($this->dirFiles)) {
            mkdir($this->dirFiles);
        }
        $dom = new \DOMDocument();
        $dom->loadXML($request);

        $id = 'SIGNED_BY_SOME_CONSUMER';
        $node = $dom->getElementsByTagName($nodeToSign)->item(0);
        $node->setAttribute('Id', $id);

        $node1 = $dom->getElementsByTagName($signContainer)->item(0);
        $d = $dom->createElementNS('urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1',
            'CallerInformationSystemSignature');
        $fragment2 = $dom->createDocumentFragment();
        $fragment2->appendXml($this->getSignatureTemplate());
        $d->appendChild($fragment2);
        $node1->appendChild($d);

        $sign = $dom->getElementsByTagName('Signature')->item(0);
        $reff = $sign->getElementsByTagName('Reference')->item(0);
        $reff->setAttribute('URI', '#'.$id);

        $request = $dom->saveXML($dom->documentElement);

        $digest = $this->makeDigest($request, $nodeToSign);
        $digestNode = $dom->getElementsByTagName('DigestValue')->item(0);
        $digestNode->nodeValue = $digest;
        $request = $dom->saveXML($dom->documentElement);

        $signature = $this->makeSign($request, 'SignedInfo');
        $signNode = $dom->getElementsByTagName('SignatureValue')->item(0);
        $signNode->nodeValue = $signature;

        $x509cert = $this->makeCert();
        $certNode = $dom->getElementsByTagName('X509Certificate')->item(0);
        $certNode->nodeValue = $x509cert;

        $this->rmDirWithFiles($this->dirFiles);

        return $dom->saveXML($dom->documentElement);
    }

    protected function rmDirWithFiles($src, $removeSrc = false)
    {
        $dir = opendir($src);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                $full = $src . '/' . $file;
                if (is_dir($full)) {
                    rmdir($full);
                } else {
                    unlink($full);
                }
            }
        }
        closedir($dir);

        if ($removeSrc) {
            return rmdir($src);
        }

        return true;
    }

}