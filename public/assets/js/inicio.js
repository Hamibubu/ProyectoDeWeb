var logged = false;

document.addEventListener('DOMContentLoaded', function() {
    welcome();
    indexForos();
});

function welcome() {
    $.ajax({
        type: "GET",
        url: "/api/welcome",
        success: function(response) {
            Swal.fire({
                title: escapeHtml(response),
                text: 'CyberMusik te da la bienvenida',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'bienvenidap',
                    title: 'bienvenidat',
                    content: 'bienvenidac'
                },
                timer: 10000
            })
            const perfilDropdown = $('.btn-group .dropdown-menu');
            const loginItem = perfilDropdown.find('li:nth-child(1)');
            const registroItem = perfilDropdown.find('li:nth-child(2)');
            loginItem.remove();
            registroItem.remove();
            const verPerfilLi = $('<li><a class="dropdown-item" href="./../../views/perfil/profile.html">Ver perfil</a></li>');
            const cerrarSesionLi = $('<li><button id="logout-button" class="dropdown-item" onclick="logout()">Cerrar Sesión</button></li>');
            perfilDropdown.append(verPerfilLi);
            perfilDropdown.append(cerrarSesionLi);
            logged = true;
        },
        error: function(xhr, textStatus, errorThrown) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'info',
                title: 'Bienvenido, parece que no has iniciado sesión',
                showConfirmButton: false,
                timer: 3000
            })
        }
      });
}

function indexForos() {
    $.ajax({
        type: "GET",
        url: "/api/index/forums",
        success: function (response) {
            console.log(response)
            var cardContent = '';
            var limit = 4;

            response.forEach((forum, index) => {
                console.log(forum._id)
                if (index < limit) {
                    cardContent += `
                        <div class="col-lg-6 mb-4">
                            <div class="card">
                                <img src="/uploads/${forum.img}" class="card-img-top" alt="Imagen Crítica 1">
                                <div class="card-body">
                                    <h5 class="card-title">${$('<div>').text(forum.name).html()}</h5>
                                    <p class="card-text">${$('<div>').text(forum.description).html()}</p>
                                    <button id="${forum._id}" class="btn btn-custom" data-logged="${logged}">Entrar</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            $('#forums').append(cardContent);
            response.forEach((forum, index) => {
                if (index < limit) {
                    $(`#${forum._id}`).on('click', function(event) {
                        event.preventDefault();
                        var logged = $(this).data('logged');
                        if (logged) {
                            window.location.href = `/api/foro/entrar/:${forum._id}`;
                        } else {
                            Swal.fire({
                                toast: true,
                                position: 'top-right',
                                icon: 'info',
                                title: 'Inicia sesión para entrar a un foro.',
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }
                    });
                }
            });
        },
        error: function(xhr, textStatus, errorThrown) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'info',
                title: 'Error al obtener los foros',
                showConfirmButton: false,
                timer: 3000
            })
        }
    });
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function logout() {
    deleteCookie("authToken");
    window.location.href = "./../../views/index/index.html";
}

function escapeHtml(unsafe) {
    return unsafe.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}