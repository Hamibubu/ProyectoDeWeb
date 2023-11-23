const publicar = document.querySelector('#publicar');
const botonPublicar = document.querySelector('#botonPublicar');
const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');
const postsEnTendencia = document.querySelector('#postsEnTendencia');
const foroForm = document.querySelector('#foroForm');
const publicacionesRecientesContainer = document.querySelector('#publicacionesRecientesContainer');
const contenidoModalComentarios = document.querySelector('#contenidoModalComentarios');
const modalComentarios = document.querySelector('#modalComentarios');
let editorComentario;
let paginaActual = 0;


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
    document.getElementById('image-upload-resena').addEventListener('change', function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('image-preview-resena');
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
        .create(document.querySelector('#NuevoComentarioResena'), {
            toolbar: {
                items: [
                    'selectAll', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'undo', 'redo', '|', 'link', 'blockQuote', 'insertTable'
                ],
                shouldNotGroupWhenFull: true
            },
        })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(document.querySelector('#resena'), {
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
            window.resena = editor;
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
                                window.publicar.setData('');
                                postForm.reset();
                                postsEnTendencia.innerHTML = '';
                                listarPublicaciones();
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
        }

    })

    // limpiar modal
    modalComentarios.addEventListener('hidden.bs.modal', function () {
        contenidoModalComentarios.innerHTML = '';
    });
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

function cargarMasPosts() {
    paginaActual++;
    listarPublicaciones(paginaActual);
}

function listarPublicaciones(pagina = 0) {
    const url = window.location.href;
    const foroID = url.substring(url.lastIndexOf('/') + 2);
    $.ajax({
        type: "GET",
        url: `/api/listar/:${foroID}?page=${pagina}`,
        success: function (datos) {
            if (datos.posts.length <= 0) {
                const div = document.createElement('div');
                div.classList.add('mb-4');
                div.innerHTML = `
                <h4 class="text-center" style="color: #f79336;">Todavía no hay publicaciones, sé el primero en publicar algo!</h4>
                `;
                postsEnTendencia.appendChild(div);
            }
            for (let i = 0; i < datos.posts.length; i++) {
                const post = datos.posts[i];
                const numLikes = post.likes.length;
                const numDislikes = post.dislikes.length;
                const div = document.createElement('div');
                // div.classList.add('col-lg-12');
                div.classList.add('mb-4');
                div.innerHTML = `
                <div class="card card-publicaciones">

                <div class="card-header" style="font-weight: bold;"><a href=""><img
                                        src="/uploads/${post.profilePhoto}" alt="foto de perfil">
                                    ${post.author} </a>${post.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}
                                    </div>
                                    ${post.img != '' ? `<img src="/uploads/${post.img}" class="card-img-top" alt="Imagen Publicacion">` : ''}
                                <div class="card-body">
                                ${post.content}
                                ${numLikes - numDislikes > 0 ? `<span id="temperatura-${post._id}" style="color: green; margin-left: 10px;">${numLikes - numDislikes}°</span>` : `<span id="temperatura-${post._id}" style="color: red; margin-left: 10px;">${numLikes - numDislikes}°</span>`}         
                                <span style="color: gray;"> - ${formatTimestamp(post.timestamp)}</span>
                                <hr style="animation: none;">
                                <button onclick="like('${post._id}')"  class="btn btn-success voto">+ <i class="fas fa-fire"></i> <span id="likes-count-${post._id}">${numLikes}</span></button>
                                <button onclick="dislike('${post._id}')" class="btn btn-danger voto">- <i class="fas fa-fire"></i> <span id="dislikes-count-${post._id}" >${numDislikes}</span></button>
                                <button onclick="mostrarModal('${post._id}')" class="btn btn-comentar comentar" data-bs-toggle="modal"
                                    data-bs-target="#modalComentarios">Comentarios <i class="fas fa-comments"></i></button>

                            </div>
                </div>
                `;
                postsEnTendencia.appendChild(div);
                if (post.authorId === datos.usuarioActualId) {
                    const btnEliminar = document.createElement('button');
                    btnEliminar.style.float = 'right';
                    btnEliminar.onclick = function () { eliminarPost(post._id); };
                    btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'eliminarBtn'); // Clase btn-sm para botón pequeño
                    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';

                    div.querySelector('.card-header ').appendChild(btnEliminar);
                }
            }
            var msnry = new Masonry('#postsEnTendencia', {
                // opciones
                itemSelector: '.card',
                columnWidth: '.card',
                percentPosition: true
            });
            imagesLoaded('#postsEnTendencia', function () {
                // Re-ejecutar Masonry después de que todas las imágenes se hayan cargado
                msnry.layout();
            });
            msnry.layout();
            if (datos.posts.length < 10) { // Asumiendo que 20 es el número máximo de publicaciones por página
                $('#verMasPosts').hide(); // Oculta el botón si no hay suficientes publicaciones para una nueva página
            } else {
                $('#verMasPosts').show(); // Muestra el botón si todavía puede haber más publicaciones para cargar
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
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;

                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste like') {
                let likesCountElement = $(`#likes-count-${postId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes - 1);
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let likesCountElement = $(`#likes-count-${postId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes + 1);
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
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
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste dislike') {
                let dislikesCountElement = $(`#dislikes-count-${postId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes - 1);
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green; ;">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let dislikesCountElement = $(`#dislikes-count-${postId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes + 1);
                let temperatura = $(`#temperatura-${postId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="temperatura-${postId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="temperatura-${postId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar dislike:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function mostrarModal(postId, pagina = 0) {
    $.ajax({
        type: "GET",
        url: `/api/mostrarModal/:${postId}`,
        success: function (datos) {
            const header = document.createElement('div');
            header.classList.add('modal-header');
            header.innerHTML = `
            <h5 class="modal-title" id="modalComentariosLabel">Comentarios - ${datos.comments.length}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            `;
            contenidoModalComentarios.appendChild(header);


            const modalBody = document.createElement('div');
            modalBody.classList.add('modal-body');
            modalBody.id = 'modalBody';
            modalBody.style.backgroundColor = '#f3f3f3';
            modalBody.innerHTML = ``;
            contenidoModalComentarios.appendChild(modalBody);
            const modalBodyID = document.querySelector('#modalBody');
            if (datos.comments.length <= 0) {
                const body = document.createElement('div');
                body.classList.add('mb-3');
                body.innerHTML = `
                <p class="text-center">Todavia no hay comentarios</p>
                `;
                modalBodyID.appendChild(body);

            } else {
                for (let i = 0; i < datos.comments.length; i++) {
                    const comment = datos.comments[i];
                    const numLikes = comment.likes.length;
                    const numDislikes = comment.dislikes.length;

                    const body = document.createElement('div');
                    body.classList.add('mb-3');
                    if (datos.comments.length == 1 || i == 0) {
                        body.innerHTML = `

                <div class="card-header" style="font-weight: bold;">
                <a href=""><img src="/uploads/${comment.profilePhoto}" alt="foto de perfil">
                                    ${comment.author} </a> ${comment.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}</div>
                                    ${comment.comment}
                                    <div class="img-comentario mb-3">
                                        ${comment.img != '' ? `<img src="/uploads/${comment.img}" class="card-img-top" alt="Imagen Comentario">` : ''}
                                    </div>
                                <button onclick="likeComment('${comment._id}')"  class="btn btn-success voto-comentario">+ <i class="fas fa-fire"></i> <span id="comment-likes-count-${comment._id}">${numLikes}</span></button>
                                <button onclick="dislikeComment('${comment._id}')" class="btn btn-danger voto-comentario">- <i class="fas fa-fire"></i> <span id="comment-dislikes-count-${comment._id}" >${numDislikes}</span></button>
                                ${numLikes - numDislikes > 0 ? `<span id="commentTemperatura-${comment._id}" style="color: green; margin-left: 10px;">${numLikes - numDislikes}°</span>` : `<span id="commentTemperatura-${comment._id}" style="color: red; margin-left: 10px;">${numLikes - numDislikes}°</span>`}         
                            <span style="color: gray;"> - ${formatTimestamp(comment.timestamp)}</span>
                                      
                            </div>
                `;
                    } else {
                        body.innerHTML = `
                <hr>

                <div class="card-header" style="font-weight: bold;">
                <a href=""><img src="/uploads/${comment.profilePhoto}" alt="foto de perfil">
                                    ${comment.author} </a> ${comment.verified == true ? ' <i class="fas fa-check-circle" style="color: rgb(46, 111, 252);"></i>' : ''}</div>
                                    ${comment.comment}
                                    <div class="img-comentario mb-3">
                                        ${comment.img != '' ? `<img src="/uploads/${comment.img}" class="card-img-top" alt="Imagen Comentario">` : ''}
                                    </div>
                                <button onclick="likeComment('${comment._id}')"  class="btn btn-success voto-comentario">+ <i class="fas fa-fire"></i> <span id="comment-likes-count-${comment._id}">${numLikes}</span></button>
                                <button onclick="dislikeComment('${comment._id}')" class="btn btn-danger voto-comentario">- <i class="fas fa-fire"></i> <span id="comment-dislikes-count-${comment._id}" >${numDislikes}</span></button>
                                ${numLikes - numDislikes > 0 ? `<span id="commentTemperatura-${comment._id}" style="color: green; margin-left: 10px;">${numLikes - numDislikes}°</span>` : `<span id="commentTemperatura-${comment._id}" style="color: red; margin-left: 10px;">${numLikes - numDislikes}°</span>`}         
                            <span style="color: gray;"> - ${formatTimestamp(comment.timestamp)}</span>
                            </div>
                `;
                    }
                    if (comment.authorId === datos.user._id) {
                        // Crear botón de eliminación
                        const btnEliminar = document.createElement('button');
                        btnEliminar.style.float = 'right';
                        btnEliminar.onclick = function () { eliminarComentario(comment._id, postId); };
                        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2', 'eliminarBtn'); 
                        btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';

                        // Añadir el botón de eliminación al comentario
                        const cardHeader = body.querySelector('.card-header');
                        cardHeader.appendChild(btnEliminar);
                    }

                    modalBodyID.appendChild(body);
                }
            }
            const footer = document.createElement('div');
            footer.classList.add('modal-footer');
            footer.style.justifyContent = 'flex-start';
            footer.innerHTML = `
            <h5 class="card-title" id="realizapublicacion" style="font-weight: lighter; "><img
                        src="/uploads/${datos.user.profilePhoto}" alt="foto de perfil" id="fotoperfil"> Añadir un
                    comentario</h5>
            <form id="formComentario" >
            <div class="form-group" id="input" >
                    <textarea class="form-control" rows="1" placeholder="Escribe un comentario..."
                        id="NuevoComentario"></textarea>
                    <div class="upload-wrapper">
                        <input class="input-group" type="file" id="image-upload-comentario" accept="image/*" />
                        <label for="image-upload-comentario" class="upload-label">Seleccionar imagen</label>
                        <div class="preview-comentario">
                            <img id="image-preview-comentario" src="#" alt="Vista previa de la imagen" style="display: none;">
                        </div>
                    </div>
                    </div>
                    <div class="d-flex justify-content-end">
                    <button onclick="enviarComentario('${datos.postId}')" type="submit" class="btn btn-custom "
                    style="width: 100px; height: 34px; padding: 5px 10px; font-size: 16px;">Comentar</button>
                    </div>
            </form>
            `;
            contenidoModalComentarios.appendChild(footer);
            ClassicEditor
                .create(document.querySelector('#NuevoComentario'), {
                    toolbar: {
                        items: [
                            'selectAll', '|',
                            'heading', '|',
                            'bold', 'italic', '|',
                            'undo', 'redo', '|', 'link', 'blockQuote', 'insertTable'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                }).then(editor => {
                    editorComentario = editor;
                })
                .catch(error => {
                    console.error(error);
                });

            document.getElementById('image-upload-comentario').addEventListener('change', function (event) {
                var reader = new FileReader();
                reader.onload = function () {
                    var output = document.getElementById('image-preview-comentario');
                    output.src = reader.result;
                    output.style.display = 'block';
                };
                reader.readAsDataURL(event.target.files[0]);
            });
        },
        error: function (error) {
            alertaPersonalizada('error', error.responseText);
            console.error('Error:', error);
        }
    })
}

function enviarComentario(postId) {
    const NuevoComentario = document.querySelector('#NuevoComentario');
    const formComentario = document.querySelector('#formComentario');
    formComentario.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
        }
        if (editorComentario.getData() == '') {
            alertaPersonalizada('warning', 'PUBLICACIÓN VACIA');
            return;
        } else {
            const formData = new FormData();
            formData.append('comment', editorComentario.getData());
            formData.append('postId', postId);
            const archivoInput = $('#image-upload-comentario')[0];
            if (archivoInput.files.length > 0) {
                formData.append('img', archivoInput.files[0]);
            }
            $.ajax({
                type: "POST",
                url: '/api/comentar',
                data: formData,
                contentType: false,
                processData: false,
                success: function (datos) {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: 'Comentando...',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    setTimeout(() => {
                        let timerInterval
                        Swal.fire({
                            title: 'COMENTADO',
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
                                formComentario.reset();
                                contenidoModalComentarios.innerHTML = '';
                                mostrarModal(postId);
                            }
                        })
                    }, 1000);
                },
                error: function (error) {
                    if (error.status == 401) {
                        alertaPersonalizada('warning', 'Primero debes iniciar sesión');
                    } else {
                        alertaPersonalizada('error', 'Ocurrio un error al comentar');
                        formComentario.reset();
                    }
                }
            })
        }
    });

}

function likeComment(commentId) {
    $.ajax({
        type: "POST",
        url: `/api/likeComment/:${commentId}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conDislikePrevio) {
                let dislikePrevio = $(`#comment-dislikes-count-${commentId}`);
                let current = parseInt(dislikePrevio.text());
                dislikePrevio.text(current - 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;

                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green;">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste like') {
                let likesCountElement = $(`#comment-likes-count-${commentId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes - 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let likesCountElement = $(`#comment-likes-count-${commentId}`);
                let currentLikes = parseInt(likesCountElement.text());
                likesCountElement.text(currentLikes + 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar like:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
        }
    });
}

function dislikeComment(commentId) {
    $.ajax({
        type: "POST",
        url: `/api/dislikeComment/:${commentId}`, // URL para registrar el like en el servidor
        success: function (datos) {
            if (datos.conLikePrevio) {
                let likePrevio = $(`#comment-likes-count-${commentId}`);
                let current = parseInt(likePrevio.text());
                likePrevio.text(current - 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            }
            if (datos.message == 'Quitaste dislike') {
                let dislikesCountElement = $(`#comment-dislikes-count-${commentId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes - 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp + 1;
                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green; ;">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            } else {
                let dislikesCountElement = $(`#comment-dislikes-count-${commentId}`);
                let currentDislikes = parseInt(dislikesCountElement.text());
                dislikesCountElement.text(currentDislikes + 1);
                let temperatura = $(`#commentTemperatura-${commentId}`);
                let currentTemp = parseInt(temperatura.text());
                currentTemp = currentTemp - 1;
                currentTemp > 0 ? temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: green; ">${currentTemp}°</span>`) : temperatura.html(`<span id="commentTemperatura-${commentId}" style="color: red; ">${currentTemp}°</span>`)
            }
        },
        error: function (error) {
            console.error("Error al dar dislike:", error.responseJSON.error);
            alertaPersonalizada('error', error.responseJSON.error);
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

function eliminarPost(postId) {
    Swal.fire({
        title: "Eliminar post?",
        html: "¿Estás seguro de que quieres eliminar este post? <br> No podrás revertirlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: `/api/post/delete/:${postId}`,
                success: function (response) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "El post ha sido eliminado",
                        icon: "success"
                    })
                    postsEnTendencia.innerHTML = '';
                    listarPublicaciones();
                },
                error: function (error) {
                    alertaPersonalizada('error', error.responseJSON.error);
                    console.error('Error:', error);
                }
            });
        }
    });
}

function eliminarComentario(commentId, postId) {
    Swal.fire({
        title: "Eliminar comentario?",
        html: "¿Estás seguro de que quieres eliminar este comentario? <br> No podrás revertirlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: `/api/comentario/delete/:${commentId}`,
                success: function (response) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "El comentario ha sido eliminado",
                        icon: "success"
                    })
                    contenidoModalComentarios.innerHTML = '';
                    mostrarModal(postId);
                },
                error: function (error) {
                    alertaPersonalizada('error', error.responseJSON.error);
                    console.error('Error:', error);
                }
            });
        }
    });
}
