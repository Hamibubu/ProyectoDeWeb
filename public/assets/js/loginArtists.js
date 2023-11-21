const formulario = document.querySelector('#formulario');
const email = document.querySelector('#email');
const pwd = document.querySelector('#pwd');

const erroremail = document.querySelector('#erroremail');
const errorpwd = document.querySelector('#errorpwd');

document.addEventListener('DOMContentLoaded', function() {
    $('#home-button').on('click', function() {
        window.location.href = "./../../views/index/index.html";
    });
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        erroremail.textContent = '';
        errorpwd.textContent = '';
        if (email.value == '') {
            erroremail.textContent = 'EL CORREO ES REQUERIDO';
        } else if(pwd.value == ''){
            errorpwd.textContent = 'LA CONTRASEÑA ES REQUERIDA';
        }else{
            const userData = {
                email: $('#email').val(),
                password: $('#pwd').val()
            };
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3000/api/login/artist",
                data: JSON.stringify(userData),
                contentType: 'application/json',
                success: function(datos){
                    const now = new Date();
                    const expiration = new Date(now.getTime() + 60 * 60 * 1000);
                    const expirationString = expiration.toUTCString();
                    document.cookie = `authToken=${datos.token}; expires=${expirationString}; path=/`;
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'success',
                        title: 'Iniciando sesion...',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    setTimeout(() => {
                        let timerInterval
                        Swal.fire({
                            title: 'BIENVENIDO',
                            html: 'Redireccionando ...',
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
                                window.location = './../../views/index/index.html';
                            }
                        })
                    }, 1000);
                    $("form")[0].reset();
                },
                error: function(error) {
                    Swal.fire({
                        toast: true,
                        position: 'top-right',
                        icon: 'error',
                        title: error.responseJSON.message,
                        // title: 'Errror al iniciar sesion, verifica tus datos',
                        showConfirmButton: false,
                        timer: 4000
                    })
                    console.error('Error:', error);
                }
            })
        }
    });
})