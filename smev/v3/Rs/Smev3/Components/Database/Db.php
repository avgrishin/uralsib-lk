<?php namespace Rs\Smev3\Components\Database;

class Db
{
    private static $instance  = null;
    private $db_host;
    private $db_login;
    private $db_password;
    private $db_port;
    private $db_name;
    private $primary_keys;

    private $connect;

    public static function getInstance()
    {
        if(is_null(self::$instance))
        {
            self::$instance = new self();
        }
        return self::$instance;
    }

    protected function __clone() {}

    private function __construct()
    {
        $this->db_host        = DbConf::$db_host;
        $this->db_login       = DbConf::$db_login;
        $this->db_password    = DbConf::$db_password;
        $this->db_port        = DbConf::$db_port;
        $this->db_name        = DbConf::$db_name;

        $connect = new \mysqli($this->db_host, $this->db_login, $this->db_password, $this->db_name, $this->db_port);
        $this->connect = $connect;
        $this->connect->query("SET NAMES 'utf8'");
        $this->connect->query('SET collation_connection = "utf8_unicode_ci"');
        $this->connect->query("SET LOCAL time_zone='".date('P')."'");

    }

    public function __destruct()
    {
        $this->connect->close();
    }

    public function insertOrUpdate($table, $data)
    {
        $new_data = [];
        foreach ($data as $key => $datum)
        {
            if($datum)
            {
                $new_data[$key] = $this->connect->escape_string($datum);
            } else {
                $new_data[$key] = '';
            }
        }

        $query = "INSERT INTO `$table` (" . implode(',' , array_keys($new_data)). ") VALUES ('" . implode("','", array_values($new_data)) . "') \n"
            . "ON DUPLICATE KEY UPDATE \n";
        $duplicate_arr = [];
        foreach ($new_data as $field => $value)
        {
            if(!$value)
            {
                $value = 'NULL';
            }
            $duplicate_arr[] = "`$field` = '$value'";
        }
        $query .= implode(",", $duplicate_arr);

        $this->connect->query($query);
    }

    /**
     * @param string $query
     * @return bool|array
     */
    public function getRow($query)
    {
        $rows = $this->getList($query);

        if(!$rows)
        {
            return false;
        }

        return $rows[0];
    }

	/**
	 * @param $table
	 * @param $key
	 * @param $value
	 * @param bool $isLike
	 * @return array|bool
	 */
    public function get($table, $key, $value, $isLike = false)
    {
    	$val = $isLike ? "'".$value."'" : $this->forSql($value);
        $query = "SELECT * FROM $table WHERE $key = ".$val;
        try{
            $res = $this->connect->query($query);
            return $res ? $res->fetch_assoc() : false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * @param $table
     * @param $key
     * @param $value
     * @return bool|void
     */
    function remove($table, $key, $value)
    {
        $query = "DELETE FROM $table WHERE $key = '$value'";
        try{
            $this->connect->query($query);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * @param $table
     * @param $data
     * @return bool|mixed|void
     * @throws \Exception
     */
    public function insert($table, $data)
    {
        $new_data = [];
        foreach ($data as $key => $datum)
        {
            $new_data[$key] = $this->connect->escape_string($datum);
        }

        //Проверка на существование первичного ключа
        $query = "SHOW COLUMNS FROM `$table`";
        $list = $this->getList($query);

        if(isset($this->primary_keys[$table]))
        {
            $primary_key_name = $this->primary_keys[$table];
        } else {
            $primary_key_name = null;
            foreach ($list as $item)
            {
                if(($item['Key'] == 'PRI') && ($item['Extra'] == 'auto_increment'))
                {
                    $primary_key_name = $item['Field'];
                }
            }
            $this->primary_keys[$table] = $primary_key_name;
        }

        $query = "INSERT INTO `$table` (" . implode(',' , array_keys($data)). ") VALUES ('" . implode("','", array_values($data)) . "')";
        $this->connect->query($query);

        if($primary_key_name)
        {
            $id = $this->connect->insert_id;
            if(!$id)
            {
                throw new \Exception($this->connect->error);
            }
            return $id;
        }
        return true;
    }

    public function update($source, $key, $data)
    {
        $values = [];
        foreach ($data as $k => $v) {
            $values[] = $this->forSQL($k) . '=' . '\''.$this->forSQL($v).'\'';
        }
        $query = "UPDATE $source SET " . implode(',', $values) . " WHERE id = " . $key;
        try{
            $res = $this->connect->query($query);
            return $res ? true : $this->connect->error;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * @param $query
     * @return array|bool
     */
    public function getList($query)
    {
        $ret = [];
        $res = $this->query($query);

        if($res)
        {
            while ($row = $res->fetch_assoc())
            {
                $ret[] = $row;
            }
            $res->close();
            return $ret;
        }
        $res->close();
        return false;
    }

    /**
     * @param $query
     * @param string|array $keyfield
     * @param bool $truncate_key_in_result
     * @return bool|array
     * @throws \Exception
     */
    public function getListByKey($query, $keyfield = 'id', $truncate_key_in_result = true)
    {
        $list = $this->getList($query);

        if(!$list)
        {
            return false;
        }

        if(!isset($list[0][$keyfield]))
        {
            throw new \Exception('Key not found or empty');
        }

        $ret = [];
        foreach ($list as $item)
        {
            if(is_array($keyfield))
            {
                $key = '';
                foreach ($keyfield as $key_row) {
                    $key .= $item[$key_row];
                }
            } else {
                $key = $item[$keyfield];
            }

            if($truncate_key_in_result && !is_array($keyfield))
            {
                unset($item[$keyfield]);
            }

            $ret[$key] = $item;
        }

        if(count($list) != count($ret))
        {
            throw new \Exception('Key not unique value');
        }

        return $ret;
    }

    /**
     * @param $query
     * @return bool|\mysqli_result
     */
    public function query($query)
    {
        try {
            $r = $this->connect->query($query);

            if(!$r)
            {
                throw new \Exception($this->connect->error);
            }
            return $r;
        } catch (\Exception $e) {
            echo '<pre>';
            var_dump($query);
            echo '</pre>';
            echo $e->getMessage();
        }
        return false;
    }

    public function forSQL($val)
    {
        return $this->connect->escape_string($val);
    }
}