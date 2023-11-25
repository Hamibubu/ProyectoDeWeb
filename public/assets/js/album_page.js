document.addEventListener('DOMContentLoaded', function() {
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
});

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