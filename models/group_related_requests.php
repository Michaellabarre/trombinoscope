<?php

    if(!empty($_POST))
    {
        require_once 'db_connexion.php';
        require_once 'student.php';
        require_once 'group.php';
        require_once '../controllers/functions.php';
        
        $group = new Group();
        
        if(isset($_POST['group_info']))
        {
            echo $group->get_group_info($_POST['group_info'], $database);
        }
        
        if(isset($_POST['groups_id']))
        {
            $g = $group->get_groups_id($database);
            foreach($g as $id)
                echo ($id === $g[count($g) - 1]) ? $id : $id . ",";
        }
        
        if(isset($_POST['groups_info']))
        {
            echo $group->get_all_groups_info($database);
        }
        
        if(isset($_POST['create']))
        {
            $group_id = null;
            if(isset($_POST['create_with_id']))
                $group_id = $_POST['create_with_id'];
            else
            {
                $result = $database->query("SELECT MAX(group_id) g_id FROM students")->fetch()->g_id;
                $group_id = ($result === NULL) ? 1 : $result + 1;
            }
            $students = json_decode($_POST['create']);
            foreach($students as $student)
                $student = new Student(wd_remove_accents($student[2]), wd_remove_accents($student[1]), $group_id, $database, $student[0]);
            echo "Le groupe a été crée avec succès.<br>ID du groupe : " . $group_id;
        }
        
        if(isset($_POST['delete_group']))
        {
            $g_id = $_POST['delete_group'];
            
            $req1 = $database->prepare("SELECT user_id FROM students WHERE group_id = ?");
            $req1->execute([$g_id]);
            
            $req2 = $database->prepare("DELETE FROM students WHERE group_id = ?");
            $req2->execute([$g_id]);
            
            while($row = $req1->fetch())
            {
                if($row->user_id != 0)
                {
                    $req3 = $database->prepare("DELETE FROM users WHERE uid = ?");
                    $req3->execute([$row->user_id]);
                }
            }
            echo "Le groupe ". $g_id ." supprimé avec succès.";
        }
        
        if(isset($_POST['csv']))
        {
            $req = $database->query("SELECT MAX(group_id) g_id FROM students");
            $group_id = ($_POST['load_into'] == "new") ? $req->fetch()->g_id + 1 : $_POST['load_into'];
            $lines = explode("\n", $_POST["csv"]);
            $error = false;
            foreach($lines as $line)
                if(count(explode(',', $line)) != 2)
                    $error = true;
            if($error)
                echo "Le format du fichier CSV est incorrect";
            else
            {
                foreach($lines as $student)
                {
                    $student = explode(",", $student);
                    $st = new Student(wd_remove_accents($student[1]), wd_remove_accents($student[0]), $group_id, $database);
                }
                echo "Le fichier CSV a été importé avec succès.";  
            }
            sleep(1);
        }
    }

?>