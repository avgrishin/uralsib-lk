<?php

return [
    'current' => 'test',
    'prod' => [
        'url' => 'http://172.20.3.12:7500/smev/v1.1/ws?wsdl',
        'signer' => [
            'class' => '\\Rs\\Smev3\\Components\\Signer\\XMLDSigSigner\\CryptoPro',
            'config' => __DIR__.'/CryptoPro/config.php'
            ]
    ],
    'test' => [
        'url' => 'http://smev3-n0.test.gosuslugi.ru:7500/smev/v1.1/ws?wsdl',
        'signer' => [
            'class' => '\\Rs\\Smev3\\Components\\Signer\\XMLDSigSigner\\CryptoPro',
            'config' => __DIR__.'/CryptoPro/config.php'
        ]
    ]
];