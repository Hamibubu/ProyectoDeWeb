document.addEventListener('DOMContentLoaded', function() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/profile",
        success: function(userData) {
            var userProfileContainer = $("#user-profile-container");
            if (userData.userType == "user"){
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
                $('#changePasswordCheckbox').change(function() {
                    if ($(this).is(':checked')) {
                        $('#passwordFields').slideDown();
                    } else {
                        $('#passwordFields').slideUp();
                    }
                });
                $('#formularioPerfil').submit(function() {
                    var cambiarContraseña = $('#changePasswordCheckbox').is(':checked');
                    var formData = new FormData(this); 
                    formData.append('username', userData.username);
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
                            })}else{
                                Swal.fire({
                                toast: true,
                                position: 'top-right',
                                icon: 'error',
                                title: 'Hubo un error al modificar su información.',
                                showConfirmButton: false,
                                timer: 4000
                            })}
                        }
                    });
                });
            }else if (userData.userType == 'artist'){
                userProfileContainer.addClass("artist-profile");
                var artistProfileHTML = `
                <div class="card artist-profile">
                    <div class="card-body">
                        <div class="text-center">
                            <img src="/uploads/${userData.profilePhoto}" alt="${userData.username}" class="img-thumbnail mb-3">
                            <h1>${userData.name}</h1>
                            <h2>@${userData.username}</h2>
                        </div>
                        <div class="bio mt-3">
                            <h3>Descripción</h3>
                            <p>${userData.description}</p>
                        </div>
                        <div class="genre">
                            <h3>Género</h3>
                            <p>${userData.genre}</p>
                        </div>
                        <div class="influences">
                            <h3>Influencias</h3>
                            <p>${userData.Influences}</p>
                        </div>
                    </div>
                </div>`
                userProfileContainer.html(artistProfileHTML);
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