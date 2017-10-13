window.onload = function()
{
    $('fieldset').animate({ height: '86%' });
    load_student();
}

String.prototype.replaceAll = function(search, replacement)
{
    var target = this;
    return target.split(search).join(replacement);
};

var Dialog = new DialogBox();
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

function load_student()
{
    $('#div_loader').show();
    $.post('./models/user_related_requests.php', 'get_student=true')
        .done(function(data)
        {
            var student = data.split('&');
            var lname = student[0];
            var fname = student[1];
            var photo = (student[2] == "NULL") ? "./data/images/no_picture_found.png" : readFormatedB64(student[2]);
            
            var html = "";
            
            html += "<p>" + lname + " " + fname + "</p>";    
            html += "<img class=img_student src=\""+photo+"\">";
            html += "<input class=ipt_file type=file accept=\"image/*\" onchange=\"update_student_photo(this)\">";
            html += "<button class=button onclick=\"confirm()\" disabled>Valider</button>";
        
            $('#div_content').append(html);
            $('#div_loader').hide();
        });
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
            reader.onload = function(e)
            {
                img.src = e.target.result;
                $('.button').prop('disabled', false);
            };
            reader.readAsDataURL(file);
        }
    }
}

function confirm()
{
    $('#div_loader').show();
    var photo = formatB64($('.img_student').attr('src'));
    $.post('./models/user_related_requests.php', 'upload_photo=' + photo)
        .done(function()
        {
            $('#div_loader').nextAll().remove();
            Dialog.show("Modifications", "Votre photo a été modifiée avec succès.");
            load_student();
            $('#div_loader').hide();
        });
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
