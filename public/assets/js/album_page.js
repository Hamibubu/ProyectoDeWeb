const botonPublicar = document.querySelector('#botonPublicar');

document.addEventListener('DOMContentLoaded', function() {
    $('#image-upload').val('');
    $('#publicar').val('');
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
            const verPerfilLi = $('<li><a class="dropdown-item" href="./../../../../views/perfil/profile.html">Ver perfil</a></li>');
            const cerrarSesionLi = $('<li><button id="logout-button" class="dropdown-item" onclick="logout()">Cerrar Sesión</button></li>');
            perfilDropdown.append(verPerfilLi);
            perfilDropdown.append(cerrarSesionLi);
        },
        error: function(xhr, textStatus, errorThrown) {
        }
      });
      postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
            alertaPersonalizada('warning', 'Primero debes llenar todos los campos');
            return;
        }
        const url = window.location.href;
        const urlObj = new URL(url);
        const albumId = urlObj.searchParams.get('albumId');
        const formData = new FormData();
        const comment = $('#publicar').val();
        if (!comment.trim()) {
            alertaPersonalizada('warning', 'Por favor, ingresa un comentario.');
            return; // Detiene la ejecución si no hay comentario
        }    
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
        url: `/api/album/like/:${albumId}?artistId=${id}`, 
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
            console.error("Error al dar like:", "Inicia sesión para dar like");
            alertaPersonalizada('error', "Inicia sesión para dar like");
        }
    });
}

function dislike(albumId) {
    const element = $('.card-text.id');
    const id = element.attr('id');
    $.ajax({
        type: "POST",
        url: `/api/album/dislike/:${albumId}?artistId=${id}`,
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
            console.error("Error al dar dislike:", "Inicia sesión para dar dislike");
            alertaPersonalizada('error', "Inicia sesión para dar dislike");
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
            allrevs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            console.log(allrevs)
            console.log(allrevs)
            const commentsList = document.querySelector('.list-group');

            commentsList.innerHTML = '';

           allrevs.forEach((rev) => {

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            const likeButton = document.createElement('button');
            likeButton.setAttribute('onclick', `likecm('${rev._id}')`);
            likeButton.classList.add('btn', 'btn-success', 'voto', 'small-button');
            likeButton.innerHTML = `+ <i class="fas fa-fire"></i> <span id="likes-count-${rev._id}">${rev.likes.length}</span>`;
            buttonsContainer.appendChild(likeButton);

            const dislikeButton = document.createElement('button');
            dislikeButton.setAttribute('onclick', `dislikecm('${rev._id}')`);
            dislikeButton.classList.add('btn', 'btn-danger', 'voto', 'small-button');
            dislikeButton.innerHTML = `- <i class="fas fa-fire"></i> <span id="dislikes-count-${rev._id}">${rev.dislikes.length}</span>`;
            buttonsContainer.appendChild(dislikeButton);

            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');

            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            const commentContent = document.createElement('div');
            commentContent.classList.add('comment-content');

            const authorDiv = document.createElement('div');
            authorDiv.classList.add('comment-author');

            const userAvatarImg = document.createElement('img');
            userAvatarImg.src = "/uploads/" + rev.albumId; 
            userAvatarImg.alt = 'Avatar del usuario';
            userAvatarImg.classList.add('user-avatar'); 
            userAvatarImg.id = 'user-avatar-circle';

            const strong = document.createElement('strong');
            strong.textContent = rev.author; 
            authorDiv.appendChild(userAvatarImg); 
            authorDiv.appendChild(strong);

            const timestampDiv = document.createElement('div');
            timestampDiv.classList.add('comment-timestamp');
            const timestampText = document.createTextNode("Hace " + formatTimestamp(rev.timestamp)); 
            timestampDiv.appendChild(timestampText);

            const commentText = document.createElement('div');
            commentText.classList.add('comment-text');
            const commentTextNode = document.createTextNode(rev.comment);
            commentText.appendChild(commentTextNode);

           
            strong.style.marginRight = '20px'; 

            if (rev.img) {
                const postImage = document.createElement('img');
                postImage.src = "/uploads/" + rev.img;
                postImage.alt = 'Foto de publicación';
                commentContent.appendChild(postImage);
            }

            commentContent.appendChild(document.createElement('br'));
            commentContent.appendChild(authorDiv);
            commentContent.appendChild(timestampDiv);
            commentContent.appendChild(document.createElement('br'));
            commentContent.appendChild(commentText);
            commentContent.appendChild(document.createElement('br'));
            commentContent.appendChild(buttonsContainer);
            commentDiv.appendChild(commentContent);
            listItem.appendChild(commentDiv);
            commentsList.appendChild(listItem);
        });
            
        },
        error: function (error) {
            alertaPersonalizada('error', "Error obteniendo albumes");
            console.error('Error:', "Error al obtener álbumes");
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

function likecm(reviewId) {
    $.ajax({
        type: "POST",
        url: `/api/review/like/:${reviewId}`, 
        success: function (datos) {
            if (datos.conDislikePrevio) {
                let dislikePrevio = $(`#dislikes-count-${reviewId}`);
                let current = parseInt(dislikePrevio.text());
                dislikePrevio.text(current - 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;

                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste like') {
                let likesCountElement = $(`#likes-count-${reviewId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes - 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let likesCountElement = $(`#likes-count-${reviewId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes + 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar like:", "Inicia sesión para dar like");
            alertaPersonalizada('error', "Inicia sesión para dar like");
        }
    });
}

function dislikecm(reviewId) {
    $.ajax({
        type: "POST",
        url: `/api/review/dislike/:${reviewId}`,
        success: function (datos) {
            if (datos.conLikePrevio) {
                let likePrevio = $(`#likes-count-${reviewId}`);
                let current = parseInt(likePrevio.text());
                likePrevio.text(current - 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste dislike') {
                let dislikesCountElement = $(`#dislikes-count-${reviewId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes - 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green; ;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let dislikesCountElement = $(`#dislikes-count-${reviewId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes + 1);
                let temperatura = $(`#temperatura-${reviewId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${reviewId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${reviewId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar dislike:", "Inicia sesión para dar dislike");
            alertaPersonalizada('error', "Inicia sesión para dar dislike");
        }
    });
}

function back(){
    const element = $('.card-text.id');
    const id = element.attr('id');
    window.location.href = `/api/artist/public/${id}`;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function logout() {
    deleteCookie("authToken");
    window.location.href = "./../../../../views/index/index.html";
}