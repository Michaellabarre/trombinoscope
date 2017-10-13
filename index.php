<?php
    
    if (version_compare(phpversion(), '5.6', '<')) 
    {
        echo "Ce service utilise une version de PHP plus récente. Veuillez mettre à jour PHP et réessayer.";
    }
    else
    {
        include_once("controllers/main_controller.php");
        $controller = new Controller();
        $controller->invoke();
    }
