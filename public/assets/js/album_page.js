const botonPublicar = document.querySelector('#botonPublicar');

document.addEventListener('DOMContentLoaded', function() {
    listpubs();
    document.getElementById('image-upload').addEventListener('change', function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('image-preview');
            output.src = reader.result;
            output.style.display = 'block';
        };
        reader.readAsDataURL(event.target.files[0]);
    });
    
    
    $.ajax({
        type: "GET",
        url: "/api/welcome",
        success: function(response) {
            const perfilDropdown = $('.btn-group .dropdown-menu');
            const loginItem = perfilDropdown.find('li:nth-child(1)');
            const registroItem = perfilDropdown.find('li:nth-child(2)');
            loginItem.remove();
            registroItem.remove();
            const verPerfilLi = $('<li><a class="dropdown-item" href="./../../views/perfil/profile.html">Ver perfil</a></li>');
            const cerrarSesionLi = $('<li><button id="logout-button" class="dropdown-item" onclick="logout()">Cerrar Sesión</button></li>');
            perfilDropdown.append(verPerfilLi);
            perfilDropdown.append(cerrarSesionLi);
        },
        error: function(xhr, textStatus, errorThrown) {
            window.location.href = "./../../views/index/index.html"; 
        }
      });
      postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
        }
        const url = window.location.href;
        const urlObj = new URL(url);
        const albumId = urlObj.searchParams.get('albumId');
        const formData = new FormData();
        const comment = $('#publicar').val();
        const archivoInput = $('#image-upload')[0];
        if (archivoInput.files.length > 0) {
            formData.append('img', archivoInput.files[0]);
        }
        formData.append('comment', comment);
        formData.append('albumId', albumId);
        $.ajax({
            type: "POST",
            url: '/api/review',
            data: formData,
            contentType: false,
            processData: false,
            success: function (datos) {
                Swal.fire({
                    toast: true,
                    position: 'top-right',
                    icon: 'success',
                    title: 'Publicando...',
                    showConfirmButton: false,
                    timer: 1000
                })
                setTimeout(() => {
                    let timerInterval
                    Swal.fire({
                        title: 'PUBLICADO',
                        // html: 'Redireccionando ...',
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
                }, 1000);
                window.publicar.setData('');
                postForm.reset();
            },
            error: function (error) {
                if (error.status == 401) {
                    alertaPersonalizada('warning', 'Primero debes iniciar sesión');
                } else {
                    alertaPersonalizada('error', 'Ocurrio un error al publicar');
                    postForm.reset();
                }
            }
        })
    })
});

function alertaPersonalizada(type, msg) {
    Swal.fire({
        toast: true,
        position: 'top-right',
        icon: type,
        title: msg,
        showConfirmButton: false,
        timer: 3000
    })
}

function like(albumId) {
    const element = $('.card-text.id');
    const id = element.attr('id');
    $.ajax({
        type: "POST",
        url: `/api/album/like/:${albumId}?artistId=${id}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conDislikePrevio) {
                let dislikePrevio = $(`#dislikes-count-${albumId}`);
                let current = parseInt(dislikePrevio.text());
                dislikePrevio.text(current - 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;

                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste like') {
                let likesCountElement = $(`#likes-count-${albumId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes - 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let likesCountElement = $(`#likes-count-${albumId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes + 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar like:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function dislike(albumId) {
    const element = $('.card-text.id');
    const id = element.attr('id');
    $.ajax({
        type: "POST",
        url: `/api/album/dislike/:${albumId}?artistId=${id}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conLikePrevio) {
                let likePrevio = $(`#likes-count-${albumId}`);
                let current = parseInt(likePrevio.text());
                likePrevio.text(current - 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste dislike') {
                let dislikesCountElement = $(`#dislikes-count-${albumId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes - 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green; ;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let dislikesCountElement = $(`#dislikes-count-${albumId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes + 1);
                let temperatura = $(`#temperatura-${albumId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${albumId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${albumId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar dislike:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function listpubs(){
    const url = window.location.href;
    const urlObj = new URL(url);
    const albumId = urlObj.searchParams.get('albumId');
    $.ajax({
        type: "GET",
        url: `/api/show/reviews/${albumId}`,
        success: function (allrevs) {
                
            const commentsList = document.querySelector('.list-group');

            // Limpia cualquier contenido existente en la lista de comentarios
            commentsList.innerHTML = '';

           // Itera sobre las reseñas y crea elementos li para cada una
           allrevs.forEach((rev) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');

            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            // Crear un elemento para la foto de la publicación
            const postImage = document.createElement('img');
            postImage.src = "/uploads/" + rev.img; // Ruta de la foto de publicación
            postImage.alt = 'Foto de publicación';

            const commentContent = document.createElement('div');
            commentContent.classList.add('comment-content');

            const authorDiv = document.createElement('div');
            authorDiv.classList.add('comment-author');

            // Crear un elemento para el pequeño avatar del usuario con un id
            const userAvatarImg = document.createElement('img');
            userAvatarImg.src = "/uploads/" + rev.albumId; // Ruta del avatar del usuario
            userAvatarImg.alt = 'Avatar del usuario';
            userAvatarImg.classList.add('user-avatar'); // Aplicar una clase CSS para dar estilo al avatar del usuario
            userAvatarImg.id = 'user-avatar-circle'; // Agregar un id para aplicar estilos CSS al círculo del avatar del usuario

            const strong = document.createElement('strong');
            strong.textContent = rev.author; // Nombre del autor
            authorDiv.appendChild(userAvatarImg); // Agrega el avatar del usuario
            authorDiv.appendChild(strong);

            const timestampDiv = document.createElement('div');
            timestampDiv.classList.add('comment-timestamp');
            const timestampText = document.createTextNode("Hace " + formatTimestamp(rev.timestamp)); // Timestamp
            timestampDiv.appendChild(timestampText);

            const commentText = document.createElement('div');
            commentText.classList.add('comment-text');
            const commentTextNode = document.createTextNode(rev.comment); // Contenido del comentario
            commentText.appendChild(commentTextNode);

            // Agrega el margen entre el avatar del usuario y el nombre (20%)
            strong.style.marginRight = '20px'; // Cambia marginLeft a marginRight para moverlo a la derecha

            // Construye la estructura del comentario con el nuevo orden
            commentContent.appendChild(postImage); // Agrega la foto de la publicación primero
            commentContent.appendChild(document.createElement('br'));
            commentContent.appendChild(authorDiv);
            commentContent.appendChild(timestampDiv);
            commentContent.appendChild(document.createElement('br'));
            commentContent.appendChild(commentText);
            commentContent.appendChild(document.createElement('br'));
            commentDiv.appendChild(commentContent);

            listItem.appendChild(commentDiv);

            // Agrega el elemento li a la lista de comentarios
            commentsList.appendChild(listItem);
        });
            
        },
        error: function (error) {
            alertaPersonalizada('error', error.responseText);
            console.error('Error:', error);
        }
    });
}

function formatTimestamp(timestamp) {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - postDate); // Diferencia en milisegundos

    const diffSeconds = Math.floor(diffTime / 1000); // Diferencia en segundos
    const diffMinutes = Math.floor(diffTime / (1000 * 60)); // Diferencia en minutos
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); // Diferencia en horas
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Diferencia en días

    if (diffDays >= 1) {
        // Más de 1 día
        if (diffDays < 7) {
            return `${diffDays} días`;
        } else if (now.getFullYear() === postDate.getFullYear()) {
            return postDate.toLocaleDateString('es', { day: 'numeric', month: 'long' });
        } else {
            return postDate.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    } else if (diffHours >= 1) {
        // Entre 1 hora y 1 día
        return `${diffHours} horas`;
    } else if (diffMinutes >= 1) {
        // Entre 1 minuto y 1 hora
        return `${diffMinutes} minutos`;
    } else {
        // Menos de 1 minuto
        return `${diffSeconds} segundos`;
    }
}