<?php
require_once 'models/user.php';
if(session_status() == PHP_SESSION_NONE)
    session_start();

class Controller
{
    public function __construct()
    {
        
    }
    
    public function invoke()
    {
        if(isset($_SESSION['user']) && $_SESSION['user']->is_authorized())
        {
            switch($_SESSION['user']->access_level())
            {
                case "administrator":
                    include('views/admin_view.php');
                    break;
                case "user":
                    include('views/user_view.php');
                    break;
                default:
                    die("Erreur interne, autorisations impossibles à déterminer");
                    break;
            }
        }
        else
        {
            include('views/authentification.html');
        }
    }
}