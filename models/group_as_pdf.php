<?php
    if(session_status() == PHP_SESSION_NONE)
        session_start();

    if(!empty($_POST) && isset($_POST['group_id']))
    {
        require_once 'db_connexion.php';
        require_once 'group.php';
        
        $group = new Group();
        $group_id = $_POST['group_id'];
        $group_info = $group->get_group_info($group_id, $database);
        
        $temp1 = explode('#', $group_info);
        $students = array();
        foreach($temp1 as $temp1_val)
            array_push($students, explode("&", $temp1_val));
        
        $_SESSION['students'] = $students;
        $_SESSION['group_id'] = $group_id;
    }
    if(isset($_SESSION['students']) && isset($_SESSION['group_id'])):
        ob_start();
?>

<style type="text/css">
    img.logo { width: 48px; height: 48px; }
    img.student { width: 64px; height: 64px; }
    table { margin: auto; text-align: center; }
    table.content td { width: 100px; }
</style>

<page>
    <link rel="icon" href="../data/images/favicon.png"/>
    
    <table class="center">
        <tr>
            <td><img class="logo" src="../data/images/favicon.png" /></td>
            <td><h2>IUT Metz - Trombinoscope</h2></td>
        </tr>
        <tr>
            <td colspan="2"><h3>Etudiants du groupe <?php echo $_SESSION['group_id'];?></h3></td>
        </tr>
    </table>
    
    <br />
    <hr />
    <br />
    
    <table class="content">
        <?php
            $i = 0;
            $html = [ 'img' => array() , 'names' => array()];
            foreach($_SESSION['students'] as $student)
            {
                if($student[3] != "")
                {
                    $src = ($student[3] != "NULL") ? str_replace('[', '/', str_replace('!', '+', $student[3])) : "../data/images/no_picture_found.png";
                    array_push($html['img'], "<td><img class=student src=\"".$src."\"></td>");
                    array_push($html['names'], "<td>".$student[1]." ".$student[2]."</td>");
                    $i++;
                }
            }
            $nbLines = $i / 6;
            $i = 0;
            for($a = 0; $a < $nbLines; $a++)
            {
                echo "<tr>";
                for($x = $i; $x < $i + 7; $x++)
                    echo ($x < count($html['img'])) ? $html['img'][$x] : "";
                echo "</tr><tr>";
                for($x = $i; $x < $i + 7; $x++)
                    echo ($x < count($html['names'])) ? $html['names'][$x] : "";
                echo "</tr>";
                $i = $i + 7;
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
        $pdf->setTestIsImage(false);
        $pdf->writeHTML($content);
        $pdf->Output('trombinoscope_groupe_'.$_SESSION['group_id'].'.pdf');
    }
    catch(HTML2PDF_exception $e)
    {
        die($e);
    }
    endif;
?>