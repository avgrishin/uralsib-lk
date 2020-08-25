<?php namespace Rs\Smev3\TypeInfo;

abstract class Base
{
    protected $fieldNS;
    protected $name;
    protected $ns;
    protected $Env;

    protected $fields = [];
    protected $prologue;
    protected $epilogue;


    protected function checkField($key)
    {
        $fields = $this->getFields();
        if (!array_key_exists($key, $fields)) {
            throw new \InvalidArgumentException($key . ' not found in field list');
        }
    }

    protected function getFields()
    {
        return $this->fields;
    }

    protected function getPrologue()
    {
        if (!$this->prologue) {
            $ns = [];
            foreach ($this->ns as $key => $valueNS) {
                $ns[] = $key . '="' . $valueNS . '"';
            }

            $this->prologue = '<' . $this->fieldNS . ':' . $this->name . ' ' . implode(' ', $ns) . '>';
        }

        return $this->prologue;
    }

    protected function getEpilogue()
    {
        if (!$this->epilogue) {
            $this->epilogue = '</' . $this->fieldNS . ':' . $this->name . '>';
        }

        return $this->epilogue;
    }

    protected function beforeSetBody(&$out)
    {

    }

    protected function getBody()
    {
        $errors = [];
        $out = [];
        $this->beforeSetBody($out);
        $fields = $this->getFields();
        foreach ($fields as $field => $fieldData) {
            $value = $fieldData['value'];
            if (!$value) {
                if (!isset($fieldData['required']) || (false !== $fieldData['required'])) {
                    $errors[] = $field . ' is required';
                }
                continue;
            }
            else if ($fieldData['regexp']) {
                preg_match($fieldData['regexp'], $value, $m);
                if (empty($m)) {
                    $hint = isset($fieldData['hints']['regexp']) ? '('.$fieldData['hints']['regexp'].')' : $fieldData['regexp'];
                    $fieldName = isset($fieldData['name']) ? $fieldData['name'] : $field;

                    $errors[] = $fieldName . ' has wrong format' . ' ' . $hint;
                }
            }
            $out[] = "<$this->fieldNS:$field>$value</$this->fieldNS:$field>";
        }

        if (!empty($errors)) {
            throw new \Exception(implode("\n", $errors));
        }

        return implode('', $out);
    }

    /**
     * @return mixed
     */
    public function getEnv()
    {
        return $this->Env;
    }

    /**
     * @param $Env
     * @return $this
     */
    public function setEnv($Env)
    {
        $this->Env = $Env;
        return $this;
    }

    public function setField($key, $value)
    {
        $this->checkField($key);
        $this->fields[$key]['value'] = $value;

        return $this;
    }

    public function setFields($data)
    {
        foreach ($data as $key => $value) {
            $this->setField($key, $value);
        }

        return $this;
    }

    public function createMessage()
    {
        $out = [];
        $out[] = $this->getPrologue();
        $out[] = $this->getBody();
        $out[] = $this->getEpilogue();

        return implode('', $out);
    }
}