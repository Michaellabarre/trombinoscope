<?php

class User
{
    private $uid;
    private $username;
    private $access_level;
    private $authorized = false;
    
    public function __construct($username, $password, $database, $access_level = NULL)
    {
        $req = $database->prepare("SELECT uid, password, access_level FROM users WHERE username = ?");
        $req->execute([$username]);
        $res = $req->fetch();
        
        $this->username = $username;
        $this->authorized = ($res && password_verify($password, $res->password)) ? true : false;
        $this->uid = ($this->authorized) ? $res->uid : NULL;
        $this->access_level = ($this->authorized) ? $res->access_level : $access_level;
    }
    
    public function is_authorized() { return $this->authorized; }
    public function access_level() { return $this->access_level; }
    public function username() { return $this->username; }
    public function get_id() { return $this->uid; }
}