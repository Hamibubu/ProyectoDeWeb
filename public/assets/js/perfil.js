document.addEventListener('DOMContentLoaded', function () {
    // Detectar cuando el formulario es enviado
    document.getElementById('formularioPerfil').addEventListener('submit', function(event) {
        // Prevenir el envío normal del formulario
        event.preventDefault();

        // Obtener los valores del formulario
        var nombre = document.getElementById('nombrePerfil').value;
        var apellido = document.getElementById('apellidoPerfil').value;
        var correo = document.getElementById('correoPerfil').value;
        var telefono = document.getElementById('telefonoPerfil').value;
        var direccion = document.getElementById('direccionPerfil').value;
        // Para la foto de perfil, tendrás que manejar la carga del archivo de manera diferente
        // var fotoPerfil = document.getElementById('fotoPerfil').files[0];
        var claveActual = document.getElementById('claveActual').value;
        var claveNueva = document.getElementById('claveNueva').value;

        // Aquí puedes hacer lo que necesites con estos datos
        // Por ejemplo, enviarlos a un servidor o mostrarlos en la consola
        console.log('Nombre:', nombre);
        console.log('Apellido:', apellido);
        // Y así sucesivamente con los demás campos
    });
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
