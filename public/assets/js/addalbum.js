$(document).ready(function() {
    $('#formularioAlbum').submit(function(event) {
        event.preventDefault();

        // Verificación de validez del formulario
        if (!this.checkValidity()) {
            event.stopPropagation();
            $(this).addClass('was-validated');
            return;
        }

        // Creación y llenado de FormData
        var formData = new FormData();
        formData.append('type', $('#type').val());
        formData.append('name', $('#name').val());
        formData.append('description', $('#description').val());
        formData.append('genre', $('#genre').val());
        formData.append('release', $('#release').val());
        const archivoInput = $('#albumPhoto')[0];
        if (archivoInput.files.length === 0) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'error',
                title: 'Por favor, selecciona una foto de portada para el álbum.',
                showConfirmButton: false,
                timer: 4000
            });
            return;
        }
        if (archivoInput.files.length > 0) {
            formData.append('albumPhoto', archivoInput.files[0]);
        }

        // Verificación de que todos los campos estén llenos
        for (let pair of formData.entries()) {
            if (pair[1] === '') {
                Swal.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'error',
                    title: 'Por favor, llena todos los campos antes de continuar.',
                    showConfirmButton: false,
                    timer: 4000
                });
                return;
            }
        }

        // Envío de datos mediante AJAX
        $.ajax({
            url: 'http://127.0.0.1:3000/api/register/albums',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function(jqXHR, settings) {
                // Imprimir la configuración de la petición AJAX para depuración
                console.log('Petición AJAX:', settings);
            },
            success: function(response) {

                Swal.fire({
                    title: 'Álbum agregado exitosamente',
                    html: 'Redireccionando ...',
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        window.location.reload();
                    }
                });
            },
            error: function(xhr, textStatus, errorThrown) {
                var errorMessage = 'Hubo un error al agregar el álbum.';
                if (xhr.responseJSON && xhr.responseJSON.error == 'Ya existe un álbum con este nombre.') {
                    errorMessage = 'Ya existe un álbum con este nombre. Por favor, elige un nombre diferente.' || '';
                }
                Swal.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'error',
                    title: errorMessage,
                    showConfirmButton: false,
                    timer: 4000
                });
            }
        });
        console.log('Petición AJAX:', ajaxSettings);
    });
});
