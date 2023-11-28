$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: `/api/del/show/albums`,
        success: function (response) {
            response.forEach(data => {
                var albumCard = $('<div>').addClass('card');

                var cardContent = `
                    <img src="/uploads/${data.albumPhoto}" class="card-img-top" alt="Portada del Álbum">
                    <div class="card-body">
                        <h5 class="card-title">${$('<div>').text(data.name).html()}</h5>
                        <p class="card-text">Año: ${$('<div>').text(data.release).html()}</p>
                        <a class="btn btn-danger" onclick="eliminarAlbum('${data._id}')">
                            <i class="fas fa-trash"></i> Eliminar Álbum
                        </a>
                    </div>
                `;

                // Usar el método .append() para agregar el contenido a la tarjeta
                albumCard.append(cardContent);

                // Agregar la tarjeta al contenedor de álbumes con jQuery
                $('#albumsContainer').append(albumCard);
            });
        },
        error: function(error) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'error',
                title: "Parace que hubo un error!",
                // title: 'Errror al iniciar sesion, verifica tus datos',
                showConfirmButton: false,
                timer: 4000
            })
            console.error('Error:', error);
        }
    });
});

function eliminarAlbum(albumId) {
    $.ajax({
        type: "DELETE",
        url: `/api/album/del/:${albumId}`,
        success: function (response) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'success',
                title: 'Eliminación exitosa',
                showConfirmButton: false,
                timer: 1000
            })
            window.location.reload();
        },
        error: function(error) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'error',
                title: "Parace que hubo un error!",
                showConfirmButton: false,
                timer: 4000
            })
            console.error('Error:', error);
        }
    });
}