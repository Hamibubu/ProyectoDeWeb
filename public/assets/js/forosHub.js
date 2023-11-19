const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');



document.addEventListener('DOMContentLoaded', function () {
    //cargar foros
    mostrarForos();
});



function mostrarForos() {
    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/api/hub',
        contentType: false,
        success: function (datos) {
            console.log(datos);
            for (let i = 0; i < datos.length; i++) {
                const foro = datos[i];

                const div = document.createElement('div');
                div.classList.add('col-lg-4');
                div.classList.add('mb-4');
                div.innerHTML = `
                <div class="card">
                            <img src="http://localhost:3000/uploads/${foro.img}" class="card-img-redondeada"
                                alt="Imagen del foro">
                            <div class="card-body">
                                <h5 class="card-title">${foro.name}  ${foro.verified == true ? '<i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}</h5>
                                <p class="card-text">${foro.description}</p>
                                <button onclick="mostrarForo('${foro._id}')" class="btn btn-custom">Entrar</button>
                            </div>
                        </div>
                `;
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