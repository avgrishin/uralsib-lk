<?php

spl_autoload_register(function($class) {
	include str_replace('\\', '/',__DIR__ . '/' . $class . '.php');
});

require_once __DIR__ . '/functions.php';

$storage = \Rs\Smev3\Components\Database\Db::getInstance();

$queryRequest = "CREATE TABLE IF NOT EXISTS `smev_request` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `uuid` varchar(60) NOT NULL,
 `timestamp` varchar(32) NOT NULL,
 `name` varchar(32) NOT NULL,
 `content` text NOT NULL,
 `response` text NOT NULL,
 `is_success` tinyint(1) NOT NULL,
 `error_message` text,
 PRIMARY KEY (`id`),
 UNIQUE KEY `uuid` (`uuid`,`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
";

$queryQueue = "CREATE TABLE IF NOT EXISTS `smev_queue` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `request_message_id` varchar(36) NOT NULL,
 `is_valid` tinyint(1) NOT NULL,
 `request_id` int(11) NOT NULL,
 `created_at` int(11) NOT NULL,
 `updated_at` int(11) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `request_message_id` (`request_message_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
";

try {
    $request = $storage->query($queryRequest);
    dd('request ok',0);
    $queue = $storage->query($queryQueue);
    dd('queue ok',0);
}
catch (\Exception $e) {
    dd('exc',0);
    dd($e->getMessage());
}