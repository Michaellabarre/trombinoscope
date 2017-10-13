<?php

class Student
{
    private $firstname;
    private $lastname;
    private $picture;
    
    public function __construct($firstname, $lastname, $group_id, $database, $picture = "NULL")
    {
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->picture = $picture;
        
        $req = $database->prepare("INSERT INTO students (lastname, firstname, photo, group_id, user_id) VALUES (?, ?, ?, ?, ?)");
        $req->execute([$this->lastname, $this->firstname, $this->picture, $group_id, 0]);
    }
}