<?php 
    if(session_status() == PHP_SESSION_NONE)
        session_start();
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Trombinoscope</title>
        
        <link rel="icon" href="./data/images/favicon.png"/>
        <link rel="stylesheet" href="./views/css/admin_view.css"/>
        
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="./views/js/admin_view.js"></script>
    </head>
    
    <header>
        <a href="#">
            <h1>IUT Metz - Trombinoscope</h1>
        </a>
        <hr>
    </header>
    
    <body>
        
        <div id="div_dialog_overlay"></div>
        <div id="div_dialog_box">
            <div>
                <div id="div_dialog_box_head"></div>
                <div id="div_dialog_box_body"></div>
                <div id="div_dialog_box_foot"></div>
            </div>
        </div>
        
        <fieldset id="fset_group">
            <legend>Groupes</legend>
            <div id="div_group">
                <button class="btn_group add" title="Créer un nouveau groupe" onclick="add_new_group()">+</button>
            </div>
        </fieldset>
        
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
                    <button onclick="Dialog.show('Informations','Le format du fichier CSV importé doit être (Nom,Prénom).<br>La taille max des photos acceptée est de 6Mo.', '<button class=btn_dialog onclick=Dialog.close()>Fermer</button>')" class="btn_info" title="Obtenir de l'aide">?</button>
                    <div class="input-file-container">
                        <input class="input-file" id="ipt_import" type="file" onchange="ask_import_confirmation()" accept=".csv">
                        <label for="ipt_import" class="input-file-trigger" tabindex="0">Importer CSV</label>
                    </div>
                    <button class="button pdf" title="Exporter le groupe en PDF" onclick="export_as_pdf()">Exporter PDF</button>
                    <button class="button getid" title="Générer et afficher les identifiants du groupe" onclick="disp_group_info()">Générer identifiants</button>
                    <button class="button valid" title="Valider toutes les modifications faites au groupe" onclick="confirm_group_edit()">Valider tout</button>
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
    
    <footer>
        <hr>
        <p>
            © 2016 IUT Metz <br/>
            <a href="./views/about.html">À propos</a>
        </p>
    </footer>
    
</html>