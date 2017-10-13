<?php 
    if(session_status() == PHP_SESSION_NONE)
        session_start();
    $_SESSION['uid'] = $_SESSION['user']->get_id();
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Trombinoscope</title>
        <link rel="icon" href="./data/images/favicon.png"/>
        <link rel="stylesheet" href="./views/css/user_view.css"/>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="./views/js/user_view.js"></script>
    </head>
    
    <header>
        <a href="#">
            <h1>IUT Metz - Trombinoscope</h1>
        </a>
    </header>
    <hr>
    <body>
        
        <div id="div_dialog_overlay"></div>
        <div id="div_dialog_box">
            <div>
                <div id="div_dialog_box_head"></div>
                <div id="div_dialog_box_body"></div>
                <div id="div_dialog_box_foot"></div>
            </div>
        </div>
        
        <fieldset id="fset_content">
            <legend id="leg_content">Contenu</legend>
            <div id="div_content">
                <div id="div_loader">
                    <span class="loader circles"><span class="loader dot"></span></span>
                    Chargement en cours...
                </div>
            </div>
            
            <div id="div_action_list">
                <div id="div_action_content">
                </div>
            </div>
        </fieldset>
        
        <fieldset id="fset_connexion_info">
            <legend>Compte</legend>
            Utilisateur : <?php echo $_SESSION['user']->username(); ?>
            <button class="button deconnect" onclick="deconnect()">Deconnexion</button>
        </fieldset>
        
    </body>
    <br/>
    <hr>
    <footer>
        <p>
            © 2016 IUT Metz <br/>
            <a href="./views/about.html">À propos</a>
        </p>
    </footer>
    
</html>