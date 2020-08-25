<?php

$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}";

if (isset($_GET['success']))
{
    header("Location: $url/#/operations/buy/approve?success={$_GET['success']}");
} elseif (isset($_GET['nopay'])) {
    header("Location: $url/#/operations/buy?nopay=1");
} else {
    header("Location: $url/#/");
}

exit();
