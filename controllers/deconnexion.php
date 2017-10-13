<?php
    
    if(!empty($_POST))
    {
        if(session_status() == PHP_SESSION_NONE)
            session_start();
        session_destroy();
    }