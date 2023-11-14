document.addEventListener('DOMContentLoaded', function() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/user/profile",
        success: function(userData) {
            console.log(userData)
            var userProfileContainer = $("#user-profile-container");
            var userProfileHTML =
            `<div class="user-profile">
                <div class="profile-photo">
                    <img src="/uploads/${userData.profilePhoto}" alt="Foto de perfil">
                </div>
                <div class="user-details">
                    <table>
                        <tr>
                            <td><strong>Nombre:</strong></td>
                            <td>${userData.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Apellido:</strong></td>
                            <td>${userData.apellido}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>${userData.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Géneros:</strong></td>
                            <td>${userData.genres}</td>
                        </tr>
                        <tr>
                            <td><strong>Álbum Favorito:</strong></td>
                            <td>${userData.albumfav}</td>
                        </tr>
                        <tr>
                            <td><strong>Teléfono:</strong></td>
                            <td>${userData.phone}</td>
                        </tr>
                        <tr>
                            <td><strong>Nombre de Usuario:</strong></td>
                            <td>${userData.username}</td>
                        </tr>
                    </table>
                </div>
            </div>`;
            userProfileContainer.html(userProfileHTML);
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