<?php

    function wd_remove_accents($str, $charset='utf-8')
    {
        $str = htmlentities($str, ENT_NOQUOTES, $charset);

        $str = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
        $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str);
        $str = preg_replace('#&[^;]+;#', '', $str);

        return $str;
    }

    function debug_student($id, $ln, $fn, $pu)
    {
        $errors = array();
        if(empty($ln) || !preg_match('/^[a-zA-Z-\'éè ]+$/', $ln))
            $errors['lastname'] = "<li>Nom de l'étudiant invalide</li>";
        if(empty($fn) || !preg_match('/^[a-zA-Z-\'éè ]+$/', $fn))
            $errors['firstname'] = "<li>Prénom de l'étudiant invalide</li>";
        return $errors;
    }

    function createUserForStudent($fname, $lname, $g_id, $database, $access_level = "user")
    {
        $username = strtolower(substr(wd_remove_accents($lname), 0, 4) . substr(wd_remove_accents($fname), 0, 4));
        $password = substr(str_shuffle(str_repeat("0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 8)), 0, 8);
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        if($access_level != "user" && $access_level != "administrator")
            die("Niveau d'accès de l'utilisateur indéfini ou incorrect.");
        
        $req1 = $database->prepare("SELECT uid FROM users WHERE username = ?");
        $req1->execute([$username]);
        $uid = $req1->fetch();
        if($uid)
        {
            $req2 = $database->prepare("DELETE FROM users WHERE uid = ?");
            $req2->execute([$uid->uid]);
        }
        
        $req2 = $database->prepare("INSERT INTO users (username, password, access_level) VALUES (?, ?, ?)");
        $req2->execute([$username, $password_hash, $access_level]);
        
        $req3 = $database->prepare("UPDATE students SET user_id = ? WHERE firstname = ? AND lastname = ?");
        $req3->execute([$database->lastInsertId(), $fname, $lname]);
        
        return [ 'firstname' => $fname, 'lastname' => $lname, 'username' => $username, 'password' => $password ];
    }

?>