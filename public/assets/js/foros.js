const publicar = document.querySelector('#publicar');
const botonPublicar = document.querySelector('#botonPublicar');
const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');
const postsEnTendencia = document.querySelector('#postsEnTendencia');
const foroForm = document.querySelector('#foroForm');



document.addEventListener('DOMContentLoaded', function () {
    listarPublicaciones();

    document.getElementById('image-upload').addEventListener('change', function(event) {
        var reader = new FileReader();
        reader.onload = function() {
            var output = document.getElementById('image-preview');
            output.src = reader.result;
            output.style.display = 'block';
        };
        reader.readAsDataURL(event.target.files[0]);
    });
    


    ClassicEditor
        .create(document.querySelector('#publicar'), {
            toolbar: {
                items: [
                    'selectAll', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'undo', 'redo', '|', 'link', 'blockQuote', 'insertTable'
                ],
                shouldNotGroupWhenFull: true
            }
        })
        .then(editor => {
            window.publicar = editor;
        })
        .catch(error => {
            console.error(error);
        });
    ClassicEditor
        .create(document.querySelector('#NuevoComentario'), {
            toolbar: {
                items: [
                    'selectAll', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'undo', 'redo', '|',
                    'imageUpload', 'mediaEmbed', 'link', 'blockQuote', 'insertTable'
                ],
                shouldNotGroupWhenFull: true
            },
        })
        .catch(error => {
            console.error(error);
        });
    ClassicEditor
        .create(document.querySelector('#NuevoComentarioResena'), {
            toolbar: {
                items: [
                    'selectAll', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'undo', 'redo', '|',
                    'imageUpload', 'mediaEmbed', 'link', 'blockQuote', 'insertTable'
                ],
                shouldNotGroupWhenFull: true
            },
        })
        .catch(error => {
            console.error(error);
        });

    // crear post
    postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
        }
        if (window.publicar.getData() == '') {
            alertaPersonalizada('warning', 'PUBLICACIÓN VACIA');
            return;
        } else {
            const url = window.location.href;
            const foroID = url.substring(url.lastIndexOf('/') + 2);
            const formData = new FormData(); // Crea un objeto FormData
            formData.append('content', window.publicar.getData());
            formData.append('foroID', foroID);
            const archivoInput = $('#image-upload')[0];
            if (archivoInput.files.length > 0) {
                formData.append('img', archivoInput.files[0]);
            }
            $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:3000/api/post',
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
                                // window.location.reload();
                            }
                        })
                    }, 1000);
                    // window.publicar.setData('');
                    postForm.reset();
                },
                error: function (error) {
                    if (error.status == 401) {
                        alertaPersonalizada('warning', 'Primero debes iniciar sesión');
                    } else {
                        alertaPersonalizada('error', 'Ocurrio un error al publicar');
                    }
                }
            })
        }

    })

})

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

function listarPublicaciones() {
    const url = window.location.href;
    const foroID = url.substring(url.lastIndexOf('/') + 2);
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/api/listar/:${foroID}`,
        success: function (datos) {
            console.log(datos);
            for (let i = 0; i < datos.length; i++) {
                const post = datos[i];
                console.log(post);
                const div = document.createElement('div');
                div.classList.add('col-lg-6');
                div.classList.add('mb-4');
                div.innerHTML = `
                <div class="card">

                <div class="card-header" style="font-weight: bold;"><a href=""><img
                                        src="/uploads/${post.profilePhoto}" alt="foto de perfil">
                                    ${post.author} </a><i class="fas fa-check-circle"
                                    style="color: rgb(46, 111, 252);"></i></div>
                                    ${post.img != '' ? `<img src="/uploads/${post.img}" class="card-img-top" alt="Imagen Publicacion">` : ''}
                                <div class="card-body">
                                ${post.content}
                                <hr>
                                <button href="#" class="btn btn-success voto">+ <i class="fas fa-fire"></i> ${post.likes}</button>
                                <button href="#" class="btn btn-danger voto">- <i class="fas fa-fire"></i> ${post.dislikes}</button>
                                <button href="#" class="btn btn-comentar comentar" data-bs-toggle="modal"
                                    data-bs-target="#modalComentarios">Comentarios <i class="fas fa-comments"></i></button>

                            </div>
                </div>
                `;
                postsEnTendencia.appendChild(div);

            }
        },
        error: function (error) {
            alertaPersonalizada('error', error.responseText);
            console.error('Error:', error);
        }
    })
}
