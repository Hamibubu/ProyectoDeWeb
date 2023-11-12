$(document).ready(() => {
    $('form').on('submit', (event) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }
        
        const userData = {
            name: $('#nombre').val(),
            apellido: $('#apellido').val(),
            username: $('#username').val(),
            genres: $('#generos').val(),
            albumfav: $('#album').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            phone: $('#telefono').val()
        };
        for (let key in userData) {
            if (userData[key] === '') {
                alert('Por favor, llena todos los campos antes de registrarte.');
                return;
            }
        }
        console.log(userData); //borrar
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/register/user",
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(datos){
                alert("Usuario Registrado exitosamente será redirigido ahora a la pestaña de login");
                window.location.href = "./../logins/login.html";
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

