$(document).ready(() => {
    $('form').on('submit', (event) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        const formData = new FormData(); // Crea un objeto FormData

        // Agrega los campos de texto al objeto FormData
        formData.append('name', $('#name').val());
        formData.append('apellido', $('#apellido').val());
        formData.append('username', $('#username').val());
        formData.append('genres', $('#generos').val());
        formData.append('albumfav', $('#album').val());
        formData.append('email', $('#email').val());
        formData.append('password', $('#password').val());
        formData.append('phone', $('#telefono').val());
        const archivoInput = $('#fotoPerfil')[0]; // Asegúrate de que el ID del input sea 'archivo'
        if (archivoInput.files.length > 0) {
            formData.append('profilePhoto', archivoInput.files[0]);
        }

        for (let pair of formData.entries()) {
            if (pair[1] === '') {
                Swal.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'error',
                    title: 'Por favor, llena todos los campos antes de registrarte.',
                    showConfirmButton: false,
                    timer: 4000
                });
                return;
            } 
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/register/user",
            data: formData,
            contentType: false,
            processData: false,
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
                if (xhr.status === 400 && response.error === "El email o username ya existe en la base") {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'error',
                        title: 'El email o username ya está registrado. Por favor, usa un email diferente.',
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