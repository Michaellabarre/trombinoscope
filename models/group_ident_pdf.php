<?php
    if(session_status() == PHP_SESSION_NONE)
        session_start();

    if(!empty($_POST) && isset($_POST['group_id']))
    {
        require_once 'db_connexion.php';
        require_once 'group.php';
        require_once '../controllers/functions.php';
        
        $group = new Group();
        $group_id = $_POST['group_id'];
        $req = $database->prepare("SELECT firstname, lastname FROM students WHERE group_id = ?");
        $req->execute([$group_id]);
        $users = array();
        while($row = $req->fetch())
            array_push($users, createUserForStudent($row->firstname, $row->lastname, $group_id, $database));
        $_SESSION['users'] = $users;
        $_SESSION['group_id'] = $group_id;
    }
    if(isset($_SESSION['users']) && isset($_SESSION['group_id'])):
        ob_start();
?>

<style type="text/css">
    img.logo { width: 48px; height: 48px; }
    table.center { margin: auto; text-align: center; }
    table.content { margin-left: 100px; }
</style>

<page>
    
    <table class="center">
        <tr>
            <td><img class="logo" src="../data/images/favicon.png" /></td>
            <td><h2>IUT Metz - Trombinoscope</h2></td>
        </tr>
        <tr>
            <td colspan="2"><h3>Identifiants du groupe <?php echo $_SESSION['group_id'];?></h3></td>
        </tr>
    </table>
    
    <br />
    <hr />
    <br />
    
    <table class="content">
        <?php
        
            foreach($_SESSION['users'] as $user)
            {
                echo "<tr><td><br />------------------------------------------------------------------------------------------------------------------</td></tr>";
                echo "<tr><td>Informations de connexion pour l'étudiant ".$user['firstname']." ".$user['lastname']." : </td></tr>";
                echo "<tr><td>Nom d'utilisateur : ".$user['username']."</td></tr>";
                echo "<tr><td>Mot de passe : ".$user['password']."</td></tr>";
            }
        ?>
    </table>
    
</page>

<?php
    $content = ob_get_clean();
    require_once("../lib/html2pdf/vendor/autoload.php");
    try
    {
        $pdf = new HTML2PDF('P', 'A4', 'fr');
        $pdf->writeHTML($content);
        $pdf->Output('identifiants_groupe_'.$_SESSION['group_id'].'.pdf');
    }
    catch(HTML2PDF_exception $e)
    {
        die($e);
    }
    endif;
?>