<?php

spl_autoload_register(function($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/' . $class . '.php';
});

require_once __DIR__ . '/functions.php';

foreach ($_POST as $key => $value) {
    $_POST[$key] = htmlspecialchars($value);
}

$Env = new \Rs\Smev3\Env(__DIR__.'/Rs/Smev3/config.php');
$InfoType = new \Rs\Smev3\TypeInfo\ESIADataVerify($_POST);
$InfoType->setEnv($Env);

$Request = new \Rs\Smev3\TypeRequest\SendRequest();
$Request->setEnv($Env);
$Request->setTypeInfo($InfoType);

$response = $Request->sendSoap();
die(json_encode($response));