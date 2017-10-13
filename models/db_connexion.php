<?php

    $db_config = array();
    $db_config['SGBD'] = 'mysql';
    $db_config['HOST'] = 'localhost';
    $db_config['DB_NAME'] = 'trombinoscope';
    $db_config['USER'] = 'root';
    $db_config['PASSWORD'] = '';

    try
    {
        $database = new PDO($db_config['SGBD'].":host=".$db_config['HOST'].";port=3306;dbname=".$db_config['DB_NAME'], $db_config['USER'], $db_config['PASSWORD']);
        $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        unset($db_config);
    }
    catch(Exception $e)
    {
        die("La connexion à la base de donnée a échouée.");
    }
?>