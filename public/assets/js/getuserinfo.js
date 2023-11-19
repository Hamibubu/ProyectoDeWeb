document.addEventListener('DOMContentLoaded', function() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/profile",
        success: function(userDataResponse) {
            $('#btnEliminarPerfil').click(function() {
                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Una vez eliminado, no podrás recuperar tu perfil.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "Sí, eliminar mi perfil",
                    cancelButtonText: "Cancelar",
                    dangerMode: true
                }).then((result) => {
                    document.body.classList.add("swal-opened");
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/api/del',
                            type: 'DELETE',
                            success: function(response) {
                                Swal.fire("¡Tu perfil ha sido eliminado!", {
                                    icon: "success",
                                }).then(() => {
                                    deleteCookie("authToken");
                                    window.location = './../../views/index/index.html'; 
                                });
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error('Error al eliminar el perfil:', errorThrown);
                                Swal.fire("Error al eliminar el perfil. Por favor, inténtalo de nuevo.", {
                                    icon: "error",
                                });
                            }
                        });
                    } else {
                        Swal.fire("Tu perfil está a salvo.", {
                            icon: "info",
                        });
                    }
                });
            });
            userData = userDataResponse;
            $('#changePasswordCheckbox').change(function() {
                if ($(this).is(':checked')) {
                    $('#passwordFields').slideDown();
                } else {
                    $('#passwordFields').slideUp();
                }
            });
            if (userData.userType == "user"){
                var userProfileContainer = $("#user-profile-container");
                $('.main-body .card-body img').attr('src', `/uploads/${userData.profilePhoto}`);
                $('.main-body .card-body h4').text(userData.name + ' ' + userData.apellido);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-envelope)').html('<i class="fas fa-envelope"></i> ' + userData.email);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-phone)').html('<i class="fas fa-phone"></i> ' + userData.phone);
                $('.main-body .card-body .text-muted.font-size-sm:has(i.fas.fa-album)').html('<strong>&#9835;</strong> Album favorito: ' + userData.albumfav);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-genre)').html('<strong>&#119070;</strong> Género favorito: ' + userData.genres);
                $('.main-body .card-body h5:has(i.fas.fa-role)').html('<strong>&#128100;</strong> ' + userData.userType);
                $('.main-body .card-body p:has(i.fas.fa-usname)').html('<i class="fas fa-usname"></i> @' + userData.username);
                $('#name').val(userData.name);
                $('#apellido').val(userData.apellido);
                $('#email').val(userData.email);
                $('#phone').val(userData.phone);
                $('#genres').val(userData.genres);
                $('#albumfav').val(userData.albumfav);
                $('#username').val(userData.username);
                $('#formularioPerfil').submit(function(event) {
                    event.preventDefault();
                    var cambiarContraseña = $('#changePasswordCheckbox').is(':checked');
                    var formData = new FormData(this);
                    if (!cambiarContraseña) {
                        formData.delete('claveActual');
                        formData.delete('password');
                    }
                    $.ajax({
                        url: '/api/edit',
                        type: 'PATCH',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function(response) {
                            setTimeout(() => {
                                let timerInterval
                                Swal.fire({
                                    title: 'Datos cambiados exitosamente',
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
                                        window.location.reload();
                                    }
                                })
                            }, 500);
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(xhr)
                            if (xhr.status === 401) {
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'Contraseña incorrecta!',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }else if (xhr.responseText == 'El username ya está en uso. Por favor, elige otro.'){
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'El username ya está en uso. Por favor, elige otro.',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }else if (xhr.responseText == 'Ya existe ese nombre de artista, si necesitas ayuda contáctanos'){
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'Ya existe ese nombre de artista, si necesitas ayuda contáctanos',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }else{
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'Hubo un error al modificar su información.',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }
                        }
                    });
                });
            }else if (userData.userType == 'artist'){
                $('.agregar-album-container').show();
                $('.main-body .card-body img').attr('src', `/uploads/${userData.profilePhoto}`);
                $('.main-body .card-body h4').text(userData.name);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-envelope)').html('<i class="fas fa-envelope"></i> ' + userData.email);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-phone)').html('<strong>&#9835;</strong> Género: ' + userData.genre);
                $('.main-body .card-body .text-muted.font-size-sm:has(i.fas.fa-album)').html('<i class="fas fa-file-alt"></i> Descripción: ' + userData.description);
                $('.main-body .card-body .text-secondary.mb-1:has(i.fas.fa-genre)').hide();
                $('.main-body .card-body h5:has(i.fas.fa-role)').html('<strong>&#127908;</strong> ' + userData.userType);
                $('.main-body .card-body p:has(i.fas.fa-usname)').html('<i class="fas fa-usname"></i> @' + userData.username);
                $('#name').val(userData.name);
                $('#apellido').val(userData.genre).attr('name', 'genre');
                $('#email').val(userData.email);
                $('#genres').val(userData.Influences).attr('name', 'Influences');
                $('#apellidoh6').text('Géneros');
                $('#phoneh6').text('Descripción');
                $('#genresh6').text('Influencias');
                $('#username').val(userData.username);
                $('.row.mb-3.hs').hide();
                var genresInput = $('#phone');
                var genresTextarea = $('<textarea></textarea>')
                    .attr('id', genresInput.attr('id'))
                    .attr('name', 'description')
                    .addClass(genresInput.attr('class'))
                    .attr('rows', '3'); 

                genresInput.replaceWith(genresTextarea);
                $('#phone').val(userData.description).attr('name', 'description');
                $('#formularioPerfil').submit(function(event) {
                    event.preventDefault();
                    var cambiarContraseña = $('#changePasswordCheckbox').is(':checked');
                    var formData = new FormData(this);
                    if (!cambiarContraseña) {
                        formData.delete('claveActual');
                        formData.delete('password');
                    }
                    $.ajax({
                        url: '/api/edit',
                        type: 'PATCH',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function(response) {
                            setTimeout(() => {
                                let timerInterval
                                Swal.fire({
                                    title: 'Datos cambiados exitosamente',
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
                                        window.location.reload();
                                    }
                                })
                            }, 500);
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            if (xhr.status === 401) {
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'Contraseña incorrecta!',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }else if (xhr.responseText == 'El username ya está en uso. Por favor, elige otro.'){
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'El username ya está en uso. Por favor, elige otro.',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }else{
                                Swal.fire({
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    title: 'Hubo un error al modificar su información.',
                                    showConfirmButton: false,
                                    timer: 4000
                                });
                            }
                        }
                    });
                });
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'info',
                title: 'Bienvenido, parece que no haz iniciado sesión',
                showConfirmButton: false,
                timer: 3000
            })
            window.location = './../../views/index/index.html';
        }
      });
});