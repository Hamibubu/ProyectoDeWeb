document.addEventListener('DOMContentLoaded', function() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/profile",
        success: function(userData) {
            var userProfileContainer = $("#user-profile-container");
            if (userData.userType == "user"){
                userProfileContainer.addClass("user-profile");
                var userProfileHTML = `
                    <div class="card user-profile">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <img src="/uploads/${userData.profilePhoto}" alt="Foto de perfil" class="img-thumbnail">
                                </div>
                                <div class="col-md-8">
                                    <h3 class="card-title">${userData.name} ${userData.apellido}</h3>
                                    <p><strong>Email:</strong> ${userData.email}</p>
                                    <p><strong>Géneros:</strong> ${userData.genres}</p>
                                    <p><strong>Álbum Favorito:</strong> ${userData.albumfav}</p>
                                    <p><strong>Teléfono:</strong> ${userData.phone}</p>
                                    <p><strong>Nombre de Usuario:</strong> ${userData.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                userProfileContainer.html(userProfileHTML);
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
        }
      });
});