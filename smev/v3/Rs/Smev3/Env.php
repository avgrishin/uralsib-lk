<?php namespace Rs\Smev3;

class Env
{
    protected $config;
    protected $mode;

    public static $TEST = 'test';
    public static $DEV = 'dev';
    public static $PROD = 'prod';

    protected function config($field)
    {
        if (!array_key_exists($field, $this->config)) {
            throw new \InvalidArgumentException('not found ' . $field . ' in config');
        }

        return $this->config[$field];
    }

    public function __construct($configPath)
    {
        $config = require $configPath;
        $this->mode = $config['current'];
        $this->config = $config[$this->mode];
    }

    public function getMode()
    {
        return $this->mode;
    }

    public function getUrl()
    {
        return $this->config('url');
    }

    public function getSigner()
    {
        $class = $this->config('signer')['class'];
        return new $class($this->config('signer')['config']);
    }
}