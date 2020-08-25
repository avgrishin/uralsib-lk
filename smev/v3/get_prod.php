<?php

spl_autoload_register(function($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/' . $class . '.php';
});

require_once __DIR__ . '/functions.php';

$c = new PDO("sqlsrv:Server=localhost;Database=testdb", "UserName", "Password");
dd($c);


$Env = new \Rs\Smev3\Env(__DIR__.'/Rs/Smev3/config.php');
$InfoType = new \Rs\Smev3\TypeInfo\ESIADataVerify();
$Request = new \Rs\Smev3\TypeRequest\GetResponse();
$Request->setEnv($Env);
$Request->setTypeInfo($InfoType);

$response = $Request->sendSoap();
dd($response);