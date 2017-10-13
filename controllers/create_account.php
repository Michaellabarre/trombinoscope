<?php

    if(isset($_POST['username']) && isset($_POST['password']))
    {
        include_once(__DIR__.'/../models/user.php');
        
        $user = new User($_POST['username'], $_POST['password']);
        
        /*
            Si utilisateur existe déjà, retourner avec erreur
            Sinon, ajouter utilisateur à la BDD et retourner avec confirmation
        */
        
        header('Location: /projet-web/index.php');
    }
