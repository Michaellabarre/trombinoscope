<?php
    if(session_status() == PHP_SESSION_NONE)
        session_start();

    if(!empty($_POST) && isset($_POST['username']) && isset($_POST['password']))
    {
        require_once __DIR__.'/../models/db_connexion.php';
        require_once __DIR__.'/../models/user.php';
        
        $_SESSION['user'] = new User($_POST['username'], $_POST['password'], $database);
        echo $_SESSION['user']->is_authorized() ? 'true' : 'false';
        sleep(1);
    }