document.addEventListener('DOMContentLoaded', function () {
    // Detectar cuando el formulario es enviado
    var togglePassword = document.querySelector('#togglePassword');
    var password = document.querySelector('#claveActual');

    togglePassword.addEventListener('click', function (e) {
        // toggle the type attribute
        var type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye / eye slash icon
        this.classList.toggle('bx-hide');
    });
});
