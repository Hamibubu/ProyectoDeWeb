const foroForm = document.querySelector('#foroForm');
const nombreForo = document.querySelector('#nombreForo');
const descripcionForo = document.querySelector('#descripcionForo');
const buscarEtiqueta = document.querySelector('#buscarEtiqueta');
const listaCheck = document.querySelectorAll('.listaEtiquetas');
let etiquetasSeleccionadas = [];



document.addEventListener('DOMContentLoaded', function () {

    // crear post
    foroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            e.stopPropagation();
        }

        const formData = new FormData(); // Crea un objeto FormData

        if (nombreForo.value == '') {
            alertaPersonalizada('warning', 'Debe ingresar un nombre para el foro');
            return;
        }else if(descripcionForo.value == ''){
            alertaPersonalizada('warning', 'Debe ingresar una descripcion para el foro');
            return;
        } else {

            formData.append('name', $('#nombreForo').val());
            formData.append('description', $('#descripcionForo').val());
            const archivoInput = $('#imagenForo')[0];
            if (archivoInput.files.length > 0) {
                formData.append('img', archivoInput.files[0]);
            }
            listaCheck.forEach(function (checkbox) {
                if (checkbox.checked) {
                    etiquetasSeleccionadas.push(checkbox.value);
                }
            });
            formData.append('flags', etiquetasSeleccionadas.join(','));
            $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:3000/api/foro',
                data: formData,
                contentType: false,
                processData: false,
                success: function (datos) {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: 'Entrando al foro...',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    setTimeout(() => {
                        let timerInterval
                        Swal.fire({
                            title: 'FORO CREADO',
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
                                //LLEVAR AL NUEVO FORO CREADO
                                // window.location.reload();
                            }
                        })
                    }, 1000);
                    foroForm.reset();
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