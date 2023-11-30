const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');
var logged = false;

document.addEventListener('DOMContentLoaded', function () {
    welcome();
    //cargar foros
    mostrarForos();
});

function mostrarForos() {
    $.ajax({
        type: "GET",
        url: '/api/hub',
        contentType: false,
        success: function (datos) {
            for (let i = 0; i < datos.length; i++) {
                const foro = datos[i];

                const div = document.createElement('div');
                div.classList.add('col-lg-4');
                div.classList.add('mb-4');

                const name = foro.name;
                const description = foro.description;

                div.innerHTML = `
                    <div class="card">
                        <img src="/uploads/${foro.img}" class="card-img-redondeada"
                            alt="Imagen del foro">
                        <div class="card-body">
                            <h5 class="card-title"></h5>
                            <p class="card-text"></p>
                            <button onclick="mostrarForo('${foro._id}')" class="btn btn-custom">Entrar</button>
                        </div>
                    </div>
                `;
                verificado = foro.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : '';
                const titleNode = document.createTextNode(name);
                const descriptionNode = document.createTextNode(description);
                const titleElement = div.querySelector('.card-title');
                const descriptionElement = div.querySelector('.card-text');
                const verificadoElement = document.createElement('span');
                verificadoElement.innerHTML = verificado;
                titleElement.appendChild(titleNode);
                titleElement.appendChild(verificadoElement)
                descriptionElement.appendChild(descriptionNode);
                forosEnTendencia.appendChild(div);
            }
        },
        error: function (error) {
            alertaPersonalizada('error', error.responseText);
            console.error('Error:', error);
        }
    })
}

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

function mostrarForo(foroId) {
    console.log(logged)
    if (logged){
        // Realizar una solicitud AJAX al servidor
        $.ajax({
            type: 'GET',
            url: `/api/foro/:${foroId}`, // Asegúrate de que esta URL sea correcta
            success: function (data) {
                //cargar html a la nueva pagina
                window.open(`/api/foro/entrar/:${foroId}`, '_self');
            },
            error: function (error) {
                // Manejar errores, como un ID que no existe o problemas de servidor
                console.error("Error al obtener los detalles del foro:", error);
            }
        });
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
}

function welcome() {
    $.ajax({
        type: "GET",
        url: "/api/welcome",
        success: function(response) {
            const perfilDropdown = $('.btn-group .dropdown-menu');
            const loginItem = perfilDropdown.find('li:nth-child(1)');
            const registroItem = perfilDropdown.find('li:nth-child(2)');
            loginItem.remove();
            registroItem.remove();
            const verPerfilLi = $('<li><a class="dropdown-item" href="./../../../views/perfil/profile.html">Ver perfil</a></li>');
            const cerrarSesionLi = $('<li><button id="logout-button" class="dropdown-item" onclick="logout()">Cerrar Sesión</button></li>');
            perfilDropdown.append(verPerfilLi);
            perfilDropdown.append(cerrarSesionLi);
            logged=true;
        },
        error: function(xhr, textStatus, errorThrown) {
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