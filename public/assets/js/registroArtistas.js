$(document).ready(() => {
    $('form').on('submit', (event) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }
        
        const artistData = {
            name: $('#nombre').val(),
            username: $('#username').val(),
            genre: $('#genre').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            description: $('#description').val(),
            Influences: $('#influences').val()
        };
        
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/register/artist",
            data: JSON.stringify(artistData),
            contentType: 'application/json',
            success: function(datos){
                alert("Artista Registrado exitosamente será redirigido ahora a la pestaña de login");
                window.location.href = "./../logins/login_artist.html";
                $("form")[0].reset();
            },
            error: function(error) {
                console.error('Error:', error);
                alert('Hubo un error al registrarlo. Inténtalo de nuevo.');
            }
        })

        $(this).addClass('was-validated');
    });
});

