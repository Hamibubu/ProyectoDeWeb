const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');



document.addEventListener('DOMContentLoaded', function () {
    //cargar foros
    mostrarForos();
});



function mostrarForos() {
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:3000/api/hub',
        contentType: false,
        success: function (datos) {
            console.log(datos);
            for (let i = 0; i < datos.length; i++) {
                const foro = datos[i];

                const div = document.createElement('div');
                div.classList.add('col-lg-4');
                div.classList.add('mb-4');

                const name = foro.name;
                const description = foro.description;

                div.innerHTML = `
                    <div class="card">
                        <img src="http://localhost:3000/uploads/${foro.img}" class="card-img-redondeada"
                            alt="Imagen del foro">
                        <div class="card-body">
                            <h5 class="card-title"></h5>
                            <p class="card-text"></p>
                            <button onclick="mostrarForo('${foro._id}')" class="btn btn-custom">Entrar</button>
                        </div>
                    </div>
                `;
                const titleNode = document.createTextNode(name);
                const descriptionNode = document.createTextNode(description);
                const titleElement = div.querySelector('.card-title');
                const descriptionElement = div.querySelector('.card-text');
                titleElement.appendChild(titleNode);
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
    // Realizar una solicitud AJAX al servidor
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:3000/api/foro/:${foroId}`, // Asegúrate de que esta URL sea correcta
        success: function (data) {
            //cargar html a la nueva pagina
            window.open(`http://127.0.0.1:3000/api/foro/entrar/:${foroId}`, '_self');
        },
        error: function (error) {
            // Manejar errores, como un ID que no existe o problemas de servidor
            console.error("Error al obtener los detalles del foro:", error);
        }
    });
}
