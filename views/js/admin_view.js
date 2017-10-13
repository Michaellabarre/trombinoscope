window.onload = function()
{
    $('fieldset').animate({ height: '86%' });
    document.querySelector("html").classList.add('js');
    
    load_groups();
}

$.fn.exists = function () { return this.length !== 0; }
String.prototype.replaceAll = function(search, replacement) { return this.split(search).join(replacement); };

var Dialog = new DialogBox();
var actual_group_id = null;

/*
** Objet DialogBox, qui permet d'afficher des données HTML sous la forme d'une boite de dialogue
*/
function DialogBox()
{
    this.show = function(header, body, footer = '<button class=btn_dialog onclick=Dialog.close()>Fermer</button>')
    {
        var dialogOverlay = $('#div_dialog_overlay');
        var dialogBox = $('#div_dialog_box');
        dialogOverlay.css('height', window.innerHeight);
        dialogOverlay.css('opacity', '0');
        dialogBox.css('left', (window.innerWidth/2) - 250);
        dialogBox.css('top', '100');
        dialogBox.css('opacity', '0');
        dialogOverlay.show();
        dialogBox.show();
        dialogOverlay.animate({opacity: '0.5'});
        dialogBox.animate({opacity: '1'});
        $('#div_dialog_box_head').html(header);
        $('#div_dialog_box_body').html(body);
        $('#div_dialog_box_foot').html(footer);
    }

    this.close = function()
    {
        $('#div_dialog_overlay').animate({opacity: '0'}, 500, 'swing', function()
        {
            $('#div_dialog_overlay').hide();
        });                          
        $('#div_dialog_box').animate({opacity: '0'}, 500, 'swing', function()
        {
            $('#div_dialog_box').hide();
        });
    }
}

/*
** Charge tous les groupes d'étudiants existants dans la page
*/
function load_groups()
{
    $.post('./models/group_related_requests.php', 'groups_id=1')
        .done(function(data)
        {
            var new_group = "<button class=\"btn_group add\" title=\"Créer un nouveau groupe\" onclick=\"add_new_group()\">+</button>";
            var no_group = "Aucun groupe d'étudiants répertorié dans la base de données.<br><br>";
            var groups = [];
            var groups_html = "";
            if(data.length == 0)
            {
                $('#div_group').html(no_group + new_group);
            }
            else
            {
                if(data.indexOf(',') == -1)
                    groups.push(data);
                else
                    groups = data.split(",");
                for(var i in groups)
                {
                    groups_html += "<div class=\"div_groups_buttons\">"+groups[i]+" : <button class=\"btn_group display\" title=\"Afficher le groupe "+groups[i]+"\" onclick=\"display_group("+groups[i]+")\"></button>" + 
                            "<button class=\"btn_group edit\" title=\"Modifier le groupe "+groups[i]+"\" onclick=\"edit_group("+groups[i]+")\"></button>" +
                            "<button class=\"btn_group delete\" title=\"Supprimer le groupe "+groups[i]+"\" onclick=\"delete_group("+groups[i]+")\"></button>" +
                            "<br></div>";
                }
                $('#div_group').html(groups_html + new_group);
                $('.div_groups_buttons').hide();
                $('.div_groups_buttons').show(500);
            }
        });
}

/*
** Modifie le contenu principal de façon à pouvoir visualiser les étudiants d'un groupe
*/
function display_group(id)
{
    $('#div_loader').nextAll().remove();
    $('#div_action_content').hide();
    $('#div_content').animate({height: '95%'});
    $('#div_loader').show(500);
    $.post('./models/group_related_requests.php', 'group_info=' + id)
        .done(function(data)
        {
            var html = "";
            var group_info = [];
            data.split('#').forEach(function(element) { group_info.push(element.split('&')); });
            for(var i in group_info)
            {
                var st_photo = (group_info[i][3] == "NULL") ? "./data/images/no_picture_found.png" : readFormatedB64(group_info[i][3]);
                html += "<figure class=fig_student>" + 
                            "<img class=img_student src=\""+st_photo+"\" >" +
                            "<figcaption>" + group_info[i][1] + " " + group_info[i][2] + "</figcaption>" +
                        "</figure>";
            }
            
            $('#div_content').append(html);
            $('#div_content').hide();
            $('#div_content').show(500);
            $('#leg_content').html("Etudiants du groupe " + id);
            $('#div_loader').hide();
            actual_group_id = id;
        });
}

/*
** Modifie le contenu principal de façon à pouvoir modifier les données des étudiants
*/
function edit_group(id)
{
    $('#div_loader').nextAll().remove();
    $('#div_content').animate({height: '85%'});
    $('#div_loader').show(500);
    $('.pdf').prop('disabled', false);
    $('.getid').prop('disabled', false);
    $.post('./models/group_related_requests.php', 'group_info=' + id)
        .done(function(data)
        {
            var html = "";
            var group_info = [];
            data.split('#').forEach(function(element) { group_info.push(element.split('&')); });
            var html = "<div class=div_students_edit>";
            for(var i in group_info)
            {
                var st_photo = (group_info[i][3] == "NULL") ? "./data/images/no_picture_found.png" : readFormatedB64(group_info[i][3]);
                html += "<div class=div_student_edit>"+
                            "<img class=img_student src=\""+st_photo+"\">"+
                            "<input class=ipt_file type=file onchange=\"update_student_photo(this)\" accept=\"image/*\">"+
                            "<input class=ipt_text_left value=\"" + group_info[i][2] + "\" placeholder=Nom>"+
                            "<input class=ipt_text_right value=\"" + group_info[i][1] + "\" placeholder=Prénom>"+
                            "<br>"+
                            "<input title=Valider class=\"ipt_submit left\" type=submit onclick=\"edit_student(this, "+group_info[i][0]+")\" value=\"&nbsp;\">"+
                            "<input title=Supprimer class=\"ipt_submit right\" type=submit onclick=\"delete_student(this, "+group_info[i][0]+")\" value=\"&nbsp;\">"+
                        "</div>";
            }
        
            html += "<button id=btn_add_student onclick=\"add_student("+id+")\" title=\"Ajouter un étudiant\">+</button></div>";

            $('#div_content').append(html);
            $('#div_content').hide();
            $('#div_content').show(500);
            $('#div_loader').hide();
            $('#div_action_content').show();
            $('#leg_content').html("Modifier le groupe " + id);
            actual_group_id = id;
        });
}

/*
** Affiche une boîte de dialogue pour demander la confirmation de suppression d'un groupe
*/
function delete_group(id)
{
    var confirm = '<button class=btn_dialog onclick="delete_group_confirmed('+id+')">Confirmer</button>';
    var cancel = '<button class=btn_dialog onclick=Dialog.close()>Annuler</button>';
    Dialog.show('Confirmation', 'La suppression d\'un groupe est irréversible.<br>Êtes-vous sûr de vouloir continuer ?', confirm + cancel);
}

/*
** Supprime tous les étudiants du groupe passé en paramètre
*/
function delete_group_confirmed(id)
{
    $('#div_loader').nextAll().remove();
    $('#div_content').animate({height: '85%'});
    $('#div_loader').show(500);
    $.post('./models/group_related_requests.php', 'delete_group=' + id)
        .done(function(ret)
        {
            Dialog.show("Suppression d'un groupe", ret);
            load_groups();
            $('#div_loader').hide();
        });
}

/*
** Modifie le contenu principal de façon à pouvoir ajouter un groupe d'étudiants
*/
function add_new_group()
{
    var html = "";
    
    html += "<div class=div_student_edit>"+
                "<img class=img_student src=\"./data/images/no_picture_found.png\">" +
                "<input class=ipt_file type=file autocomplete=off onchange=\"update_student_photo(this)\" accept=\"image/*\">" + 
                "<input class=ipt_text_left placeholder=Nom>" +
                "<input class=ipt_text_right placeholder=Prénom>" +
            "</div>";
    
    html += "<button id=btn_add_student onclick=\"add_student(-1)\" title=\"Ajouter un étudiant\">+</button>";
    
    $('#div_loader').nextAll().remove();
    $('#div_content').append(html);
    $('.div_student_edit').last().hide();
    $('.div_student_edit').last().show(500);
    $('#div_action_content').show(500);
    $('.pdf').prop('disabled', true);
    $('.getid').prop('disabled', true);
    $('#leg_content').html("Créer un nouveau groupe");
    if($('#div_content').css('height') != '85%')
        $('#div_content').animate({height: '85%'});
    actual_group_id = null;
}

/*
** Permet d'afficher un aperçu de la photo d'un étudiant lorsqu'elle est modifiée.
*/
function update_student_photo(sender)
{
    if(sender.files)
    {
        var img = sender.previousSibling;
        var file = sender.files[0];
        var fileType = file["type"];
        var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
        if ($.inArray(fileType, validImageTypes) < 0) 
        {
            Dialog.show("Erreur", "Format du fichier invalide. Les formats acceptés sont : gif, jpeg, png. ");
        }
        else if(file.size > 6291456)
        {
            Dialog.show("Erreur", "La taille du fichier (~"+(file.size/1000000*0.95367431640625).toFixed(2)+" Mo) dépasse la limite autorisée (6 Mo)")
        }
        else
        {
            var reader = new FileReader();
            reader.onload = function(e) { img.src = e.target.result; };
            reader.readAsDataURL(file);
        }
    }
}

/*
** Si l'id envoyé en paramètre correspond à un étudiant, une requête est envoyée pour modifier les données de ce dernier,
** sinon, un nouvel étudiant est crée dans la base de données
*/
function edit_student(sender, student_id)
{
    var inputs = $(sender).prevAll('input');
    var st_firstname = inputs[0].value;
    var st_lastname = inputs[1].value;
    var st_photo = formatB64($(sender).prevAll('img').attr('src'));
    var post = 'st_photo=' + st_photo + '&st_lastname=' + st_lastname + '&st_firstname=' + st_firstname + '&st_id=' + student_id;
    if(student_id != -1)
    {
        $.post('./models/user_related_requests.php', 'edit_student=1&' + post)
            .done(function(data)
            {
                Dialog.show("Modification d'un étudiant", data);
            });
    }
    else
    {
        if(actual_group_id != null)
        {
            $.post('./models/user_related_requests.php', 'add_student=1&' + post + '&g_id=' + actual_group_id)
                .done(function(data)
                {
                    Dialog.show("Ajout d'un étudiant", data);
                });
        }
    }
}

/*
** Supprime l'étudiant ayant l'id passé en paramètre s'il existe
*/
function delete_student(sender, student_id)
{
    var student_div = $(sender);
    if(student_id != -1)
    {
        student_div.parent().hide(500);
        student_div.fadeOut('slow', function()
        {
            $(this).parent().remove();
            if(!$('.div_student_edit').exists())
            {
                $('#div_content').hide(500);
                $('#div_action_content').hide(500);
                $('#div_content').fadeOut('slow', function() { $('#div_content').empty(); });
                $('#leg_content').html("Contenu");
                load_groups();
            }
        });
        $.post('./models/user_related_requests.php', 'delete_student=' + student_id);
    }
    else
    {
        student_div.parent().hide(500);
        student_div.fadeOut('slow', function()
        {
            $(this).parent().remove();
        });
    }
}

/*
** Ajoute les éléments HTML nécessaires au contenu pour pouvoir créer un nouvel étudiant
*/
function add_student(group_id)
{
    if(group_id == -1)
    {
        $('#btn_add_student').remove();
        var html = "";

        html += "<div class=div_student_edit>"+
                    "<img class=img_student src=\"./data/images/no_picture_found.png\">" +
                    "<input class=ipt_file type=file autocomplete=off onchange=\"update_student_photo(this)\" accept=\"image/*\">" + 
                    "<input class=ipt_text_left placeholder=Nom>" +
                    "<input class=ipt_text_right placeholder=Prénom>" +
                "</div>";

        var add_btn = "<button id=btn_add_student onclick=\"add_student(-1)\" title=\"Ajouter un étudiant\">+</button>";

        $('#div_content').append(html);
        $('#div_content').append(add_btn);
        $('.div_student_edit').last().hide();
        $('.div_student_edit').last().show(500);
    }
    else
    {
        $('#btn_add_student').remove();
        var html = "";
        
        html += "<div class=div_student_edit>"+
                    "<img class=img_student src=\"./data/images/no_picture_found.png\">" +
                    "<input class=ipt_file type=file autocomplete=off onchange=\"update_student_photo(this)\" accept=\"image/*\">" + 
                    "<input class=ipt_text_left placeholder=Nom>" +
                    "<input class=ipt_text_right placeholder=Prénom>" +
                    "<input id=validbtn title=\"Valider\" class=\"ipt_submit left\" type=submit onclick=\"edit_student(this, -1)\" value=\"&nbsp;\">"+
                    "<input title=\"Supprimer\" class=\"ipt_submit right\" type=submit onclick=\"delete_student(this, -1)\" value=\"&nbsp;\">"
                "</div>";

        var add_btn = "<button id=btn_add_student onclick=\"add_student("+group_id+")\" title=\"Ajouter un étudiant\">+</button>";
        
        $('.div_students_edit').append(html);
        $('.div_students_edit').append(add_btn);
        $('.div_student_edit').last().hide();
        $('.div_student_edit').last().show(500);
    }
}

/*
** Formate un chaîne codée en base64 de façon à ce que les caractères + et / ne posent pas de problème
*/
function formatB64(str)
{
    var ret = str.replaceAll('+', '!');
    return ret.replaceAll('/', '[');
}

/*
** Récupère une chaîne en base64 sur laquelle on a appliqué un formatage (voir au dessus), et l'inverse
** de façon à rendre la chaîne lisible
*/
function readFormatedB64(str)
{
    var ret = str.replaceAll('!', '+');
    return ret.replaceAll('[', '/');
}

/*
** Retourne un tableau contenant 1 case par étudiant, cette case contenant un tableau de 3 cases correspondants
** respectivement aux données de la photo, au nom et au prénom de l'étudiant
*/
function get_group_data()
{
    var divs = $('.div_student_edit');
    var group_data = [];
    for(var i = 0; i < divs.length; i++)
    {
        var childs = divs.get(i).childNodes;
        var photo = formatB64(childs[0].src);
        if(childs[2].value != "" && childs[3].value != "")
            group_data.push([photo, childs[2].value, childs[3].value]);
    }
    if(group_data.length == 0)
        Dialog.show('Créer un groupe', "Groupe vide. Vous devez renseigner au moins 1 étudiant.");
    return group_data;
}

/*
** Si un groupe existant est chargé en mémoire, cette fonction demande une confirmation et redirige.
** Sinon, elle envoie une requête pour créer un nouveau groupe.
*/
function confirm_group_edit()
{
    if(actual_group_id == null)
    {
        var group_data = get_group_data();
        if(group_data.length != 0)
            $.post('./models/group_related_requests.php', 'create=' + JSON.stringify(group_data))
            .done(function(data)
            {
                Dialog.show('Créer un groupe', data);
                $('#div_loader').nextAll().remove();
                $('#div_action_content').hide();
                load_groups();
            });
    }
    else
    {
        ask_group_edit_confirmation(actual_group_id);
    }
}

/*
** Affiche une boîte de dialogue pour demander la confirmation des modifications effectuées à un groupe d'étudiant
*/
function ask_group_edit_confirmation(id)
{
    var confirm = '<button class=btn_dialog onclick="edit_groups_students('+id+')">Confirmer</button>';
    var cancel = '<button class=btn_dialog onclick=Dialog.close()>Annuler</button>';
    Dialog.show('Confirmation', 'Êtes-vous sûr de vouloir valider toutes les modifications effectuées ?', confirm + cancel);
}

/*
** Exécute les modifications effectuées sur tous les étudiants du groupe.
*/
function edit_groups_students(id)
{
    Dialog.close();
    var g_data = get_group_data();
    if(g_data.length != 0)
    {
        $('#div_loader').nextAll().remove();
        $('#div_loader').show(500);
        $.post('./models/group_related_requests.php', 'delete_group=' + id + '&create_with_id=' + id + '&create=' + JSON.stringify(g_data))
            .done(function(data)
            {
                Dialog.show('Modifier un groupe', "Groupe " + id + " modifié avec succès.");
                $('#div_loader').hide();
            });
    }
}

/*
** Déconnecte l'utilisateur.
*/
function deconnect()
{
    $.post('./controllers/deconnexion.php', 'deco=true')
        .done(function()
        {
            location.reload();
        });
}

/*
** Affiche une boîte de dialogue pour demander la confirmation de l'import d'un fichier CSV
*/
function ask_import_confirmation()
{
    var confirm = '<button class=btn_dialog onclick="import_from_csv()">Confirmer</button>';
    var cancel = '<button class=btn_dialog onclick=Dialog.close()>Annuler</button>';
    Dialog.show('Confirmation', 'Cette action écrasera toutes les précédentes<br>données de ce groupe d\'étudiant.<br>Êtes-vous sûr de vouloir continuer ?', confirm + cancel);
}

/*
** Charge le contenu du fichier CSV et envoie la requête adéquate
*/
function import_from_csv()
{
    Dialog.close();
    $('#div_loader').nextAll().remove();
    $('#div_loader').show(500);
    var file = document.getElementById('ipt_import').files[0];
    var fr = new FileReader();
    var load_into = 'new';
    if(actual_group_id != null)
        load_into = actual_group_id;
    if(load_into != 'new')
        $.post('./models/group_related_requests.php', 'delete_group=' + load_into);
    fr.onload = function(e) 
    {
        $.post('./models/group_related_requests.php', 'csv=' + e.target.result + '&load_into=' + load_into)
            .done(function(data)
            {
                Dialog.show('Importer un groupe', data);
                load_groups();
                $('#div_loader').hide();
                $('#div_action_content').hide();
            });
    };
    fr.readAsText(file);
}

/*
** Envoie une requête pour afficher le trombinoscope au format PDF
*/
function export_as_pdf()
{
    if(actual_group_id != null)
    {
        $('#div_loader').nextAll().remove();
        $('#div_action_content').hide();
        $('#div_loader').show(500);
        $.post('./models/group_as_pdf.php', 'group_id=' + actual_group_id)
            .done(function()
            {
                var win = window.open('./models/group_as_pdf.php', '_blank');
                if(win)
                    win.focus();
                else
                    Dialog.show('Information', "Les fenêtres pop-up sont bloquées sur cette page.<br>Ceci empêche l'affichage du PDF.<br>Veuillez réessayer après avoir autorisé l'affichage des pop-up.");
                $('#div_loader').hide();
            });
    }
        
        
        
}

/*
** Envoie une requête pour afficher un PDF contenant les identifiants des étudiants du groupe
*/
function disp_group_info()
{
    if(actual_group_id != null)
    {
        $('#div_loader').nextAll().remove();
        $('#div_action_content').hide();
        $('#div_loader').show(500);
        $.post('./models/group_ident_pdf.php', 'group_id=' + actual_group_id)
            .done(function(data)
            {
                var win = window.open('./models/group_ident_pdf.php', '_blank');
                if(win)
                    win.focus();
                else
                    Dialog.show('Information', "Les fenêtres pop-up sont bloquées sur cette page.<br>Ceci empêche l'affichage du PDF.<br>Veuillez réessayer après avoir autorisé l'affichage des pop-up.");
                $('#div_loader').hide();
            });
    }
}
