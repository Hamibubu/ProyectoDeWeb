const publicar = document.querySelector('#publicar');
const botonPublicar = document.querySelector('#botonPublicar');
const forosEnTendencia = document.querySelector('#forosEnTendencia');
const forosQueTePodrianInteresar = document.querySelector('#forosQueTePodrianInteresar');



document.addEventListener('DOMContentLoaded', function () {


    ClassicEditor
        .create(document.querySelector('#publicar'), {
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
    botonPublicar.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.publicar.getData() == '') {
            alertaPersonalizada('warning', 'PUBLICACIÓN VACIA');
            return;
        } else {
            const content = {
                content: window.publicar.getData(),
                foroID: 'aqui va el id del foro'
            };
            $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:3000/api/post',
                data: JSON.stringify(content),
                contentType: 'application/json',
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
                    window.publicar.setData('');
                },
                error: function (error) {
                    alertaPersonalizada('error', error.responseText);
                    console.error('Error:', error);
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