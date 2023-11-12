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
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/register/user",
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(datos){
                setTimeout(() => {
                    let timerInterval
                    Swal.fire({
                        title: 'Usuario registrado exitosamente',
                        html: 'Redireccionando ...',
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                            }, 1000)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            window.location = './../logins/login.html';
                        }
                    })
                }, 1000);
            },
            error: function(xhr, status, err) {
                console.error('Error:', err);
                var response = JSON.parse(xhr.responseText);
                if (xhr.status === 400 && response.error === "El email ya existe en la base") {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'error',
                        title: 'El email ya está registrado. Por favor, usa un email diferente.',
                        showConfirmButton: false,
                        timer: 4000
                    })
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'error',
                        title: 'Hubo un error al registrarlo. Inténtalo de nuevo.',
                        showConfirmButton: false,
                        timer: 4000
                    })
                }
            }
        })

        $(this).addClass('was-validated');
    });
});
