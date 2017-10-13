$(document).ready(function()
{
    $('input:first').focus();
    //$('#div_loader').css('top', (window.innerHeight/2) - ($('#div_loader').height()/2) - 100);
    //$('#div_loader').css('left', (window.innerWidth/2) - $('#div_loader').width()/2);
    /*
    ** Lorsque le formulaire est envoyé, on annule l'envoi automatique du navigateur
    ** et on utilise la méthode post d'Ajax pour envoyer les entrées sérialisés.
    ** Ici n'est pas géré le cas d'erreur du serveur avec la méthode fail, pour
    ** des raisons pratique.
    */
    
    $('#form_connexion').on('submit', function(e)
    {
        e.preventDefault();
        $('#error_message').hide();
        $('#div_loader').show(500);
        $.post($(this).attr('action'), $(this).serializeArray())
            .done(function(data, text, jqhxr)
            {
                if(data === 'true') 
                    location.reload();
                else
                    $('#error_message').show();
            })
            .always(function()
            {
                $('#div_loader').hide();
                $('#div_content').show(500);
            });
    });
    
    /*
    ** Lorsque l'utilisateur appuie sur la touche Entrée
    ** On déclenche l'évènement submit du formulaire (voir au dessus).
    */
    $('input').on('keypress', function(e)
    {
        if(e.keyCode == 13)
            $('#form_connexion').trigger('submit');
    })
});

/* A titre de démonstration, voici à quoi ressemblerait l'envoi de la requête Ajax sans utiliser Jquery :

var form = document.getElementById('form_connexion');
form.addEventListener('submit', function(e)
{
    e.preventDefault();
    var err = document.getElementById('error_message');
    var content = document.getElementById('div_content');
    var loader = document.getElementById('div_loader');
    var data = 'username=' + document.getElementsByTagName('input')[0].value + '&password=' + document.getElementsByTagName('input')[1].value;

    content.style.display = "none";
    loader.style.display = "block";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            if(xhr.responseText == "true")
                location.reload();
            else
                err.style.display = "block";
        }
    };

    xhr.open('POST', "./controllers/authentification.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data); 
});
    
*/