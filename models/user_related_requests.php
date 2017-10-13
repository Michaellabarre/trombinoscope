<?php
    
    if(session_status() == PHP_SESSION_NONE)
        session_start();

    if(!empty($_POST))
    {
        require_once 'db_connexion.php';
        require_once 'student.php';
        require_once 'user.php';
        require_once '../controllers/functions.php';
        
        if(isset($_POST['add_student']) && isset($_POST['g_id']))
        {
            $ln = $_POST['st_lastname'];
            $fn = $_POST['st_firstname'];
            $pu = $_POST['st_photo'];
            $errors = debug_student(0, $ln, $fn, $pu);
            
            if(empty($errors))
            {
                $student = new Student(wd_remove_accents($fn), wd_remove_accents($ln), $pu, $_POST['g_id'], $database);
                echo "L'étudiant " . $fn . " " . $ln . " a été ajouté à la base de donnée.";
            }
            else
            {
                echo "<p>Erreurs : <br><ul>" . $errors['lastname'] . $errors['firstname'] . "</ul></p>";
            }
        }
        
        if(isset($_POST['edit_student']))
        {
            $ln = $_POST['st_lastname'];
            $fn = $_POST['st_firstname'];
            $pu = $_POST['st_photo'];
            $id = $_POST['st_id'];
            $errors = debug_student($id, $ln, $fn, $pu);
            
            if(empty($errors))
            {
                $req1 = $database->prepare("UPDATE students SET lastname = ?, firstname = ?, photo = ? WHERE student_id = ?");
                $req1->execute([$ln, $fn, $pu, $id]);
                
                $req2 = $database->prepare("SELECT user_id FROM students WHERE student_id = ?");
                $req2->execute([$id]);
                $uid = $req2->fetch();
                if($uid && $uid->user_id != 0)
                {
                    $username = strtolower(substr(wd_remove_accents($ln), 0, 4) . substr(wd_remove_accents($fn), 0, 4));
                    $req3 = $database->prepare("UPDATE users SET username = ? WHERE uid = ?");
                    $req3->execute([$username, $uid->user_id]);
                }
                echo "<p>Les modifications ont été effectués avec succès.</p>";
            }
            else
            {
                echo "<p>Erreurs : <br><ul>".$errors['lastname'] . $errors['firstname'] . "</ul></p>";
            }
        }
             
        if(isset($_POST['delete_student']))
        {
            $req1 = $database->prepare("SELECT user_id FROM students WHERE student_id = ?");
            $req2 = $database->prepare("DELETE FROM users WHERE uid = ?");
            $req3 = $database->prepare("DELETE FROM students WHERE student_id = ?");
            
            $req1->execute([$_POST['delete_student']]);
            $req2->execute([$req1->fetch()->user_id]);
            $req3->execute([$_POST['delete_student']]);
        }
    
        if(isset($_POST['get_student']))
        {
            $req1 = $database->prepare("SELECT lastname, firstname, photo FROM students WHERE user_id = ?");
            $req1->execute([$_SESSION['uid']]);
            $result = $req1->fetch();
            $ret = $result->lastname . "&" . $result->firstname . "&" . $result->photo;
            echo $ret;
        }
        
        if(isset($_POST['upload_photo']))
        {
            $req1 = $database->prepare("UPDATE students SET photo = ? WHERE user_id = ?");
            $req1->execute([$_POST['upload_photo'], $_SESSION['uid']]);
        }
        
    }
    

?>