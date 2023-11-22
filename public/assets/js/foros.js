const publicar = document.querySelector('#publicar');
const botonPublicar = document.querySelector('#botonPublicar');
const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');
const postsEnTendencia = document.querySelector('#postsEnTendencia');
const foroForm = document.querySelector('#foroForm');
const publicacionesRecientesContainer = document.querySelector('#publicacionesRecientesContainer');


document.addEventListener('DOMContentLoaded', function () {
    listarPublicaciones();

    document.getElementById('image-upload').addEventListener('change', function (event) {
        var reader = new FileReader();
        reader.onload = function () {
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
                url: '/api/post',
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
                                postForm.reset();
                                postsEnTendencia.innerHTML = '';
                                listarPublicaciones();
                            }
                        })
                    }, 1000);
                    // window.publicar.setData('');
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
        url: `http://127.0.0.1:3000/api/listar/:${foroID}`,
        success: function (datos) {
            for (let i = 0; i < datos.length; i++) {
                const post = datos[i];
                const numLikes = post.likes.length;
                const numDislikes = post.dislikes.length;
                const div = document.createElement('div');
                div.classList.add('col-lg-6');
                div.classList.add('mb-4');
                div.innerHTML = `
                <div class="card">

                <div class="card-header" style="font-weight: bold;"><a href=""><img
                                        src="/uploads/${post.profilePhoto}" alt="foto de perfil">
                                    ${post.author} </a>${post.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}</div>
                                    ${post.img != '' ? `<img src="/uploads/${post.img}" class="card-img-top" alt="Imagen Publicacion">` : ''}
                                <div class="card-body">
                                ${post.content}
                                <hr>
                                <button onclick="like('${post._id}')"  class="btn btn-success voto">+ <i class="fas fa-fire"></i> <span id="likes-count-${post._id}">${numLikes}</span></button>
                                <button onclick="dislike('${post._id}')" class="btn btn-danger voto">- <i class="fas fa-fire"></i> <span id="dislikes-count-${post._id}" >${numDislikes}</span></button>
                                <button onclick="mostrarModal('${post._id}')" class="btn btn-comentar comentar" data-bs-toggle="modal"
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

function like(postId) {
    $.ajax({
        type: "POST",
        url: `/api/like/:${postId}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conDislikePrevio) {
                let dislikePrevio = $(`#dislikes-count-${postId}`);
                let current = parseInt(dislikePrevio.text());
                dislikePrevio.text(current - 1);
            }
            if (datos.message == 'Quitaste like') {
                let likesCountElement = $(`#likes-count-${postId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes - 1);
            } else {
                let likesCountElement = $(`#likes-count-${postId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes + 1);
            }
        },
        error: function (error) {
            console.error("Error al dar like:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function dislike(postId) {
    $.ajax({
        type: "POST",
        url: `/api/dislike/:${postId}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conLikePrevio) {
                let likePrevio = $(`#likes-count-${postId}`);
                let current = parseInt(likePrevio.text());
                likePrevio.text(current - 1);
            }
            if (datos.message == 'Quitaste dislike') {
                let dislikesCountElement = $(`#dislikes-count-${postId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes - 1);
            } else {
                let dislikesCountElement = $(`#dislikes-count-${postId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes + 1);
            }
        },
        error: function (error) {
            console.error("Error al dar dislike:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function mostrarModal(postId) {
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:3000/api/mostrarModal/:${postId}`,
        success: function (datos) {
            for (let i = 0; i < datos.length; i++) {
                const post = datos[i];
                const numLikes = post.likes.length;
                const numDislikes = post.dislikes.length;
                const div = document.createElement('div');
                div.classList.add('col-lg-6');
                div.classList.add('mb-4');
                div.innerHTML = `
                <div class="card">

                <div class="card-header" style="font-weight: bold;"><a href=""><img
                                        src="/uploads/${post.profilePhoto}" alt="foto de perfil">
                                    ${post.author} </a>${post.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}</div>
                                    ${post.img != '' ? `<img src="/uploads/${post.img}" class="card-img-top" alt="Imagen Publicacion">` : ''}
                                <div class="card-body">
                                ${post.content}
                                <hr>
                                <button onclick="like('${post._id}')"  class="btn btn-success voto">+ <i class="fas fa-fire"></i> <span id="likes-count-${post._id}">${numLikes}</span></button>
                                <button onclick="dislike('${post._id}')" class="btn btn-danger voto">- <i class="fas fa-fire"></i> <span id="dislikes-count-${post._id}" >${numDislikes}</span></button>
                                <button onclick="listarComentarios('${post._id}')" class="btn btn-comentar comentar" data-bs-toggle="modal"
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