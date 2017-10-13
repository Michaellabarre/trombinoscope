<?php

class Group
{
    public function __construct()
    {
        
    }
    
    public function get_groups_id($database)
    {
        $req = $database->query("SELECT DISTINCT group_id FROM students ORDER BY group_id ASC");
        $res = $req->fetchAll();
        $arr = array();
        foreach($res as $val)
            array_push($arr, $val->group_id);
        return $arr;
    }
    
    public function get_group_info($id, $database)
    {
        $req = $database->query("SELECT student_id, firstname, lastname, photo FROM students WHERE group_id = '$id' ORDER BY student_id");
        $ret = "";
        $rows = $req->fetchAll();
        foreach($rows as $row)
        {
            $separator = ($row === $rows[count($rows) - 1]) ? "" : "#";
            $ret .= $row->student_id . "&" . $row->firstname . "&" . $row->lastname . "&" . $row->photo . $separator;
        }
        return $ret;
    }
    
    public function get_all_groups_info($database)
    {
        $groups_info = array();
        $groups_id = array();
        foreach($this->get_groups_id($database) as $id)
        {
            array_push($groups_info, $this->get_group_info($id, $database));
            array_push($groups_id, $id);
        }
        $ret = "";
        $i = 0;
        foreach($groups_info as $info)
        {
            $ret .= "GROUP_ID = " . $groups_id[$i] . " [";
            foreach($info as $student)
                $ret .= ($student === end($info)) ? implode(';', array_unique($student)) : implode(';', array_unique($student)).'&';
            $ret .= " ] ";
            $i++;
        }
        return $ret;
    }
    
}