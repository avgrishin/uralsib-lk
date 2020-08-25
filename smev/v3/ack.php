<?php

spl_autoload_register(function($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/' . $class . '.php';
});

require_once __DIR__ . '/functions.php';

$Env = new \Rs\Smev3\Env(__DIR__.'/Rs/Smev3/config.php');
$Request = new \Rs\Smev3\TypeRequest\Ack();
$hasMessage = $Request->findMessageToAck();
if (!$hasMessage) {
    dd('messages to ack not found');
    return;
}
$Request->setEnv($Env);

$response = $Request->sendSoap();
dd($response);