submit-btn.addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera predeterminada
    Swal.fire({
        title: '¡Listo!',
        text: 'Tu pago ha sido procesado, espera tu confirmación por correo electrónico.',
        icon: 'success'
    });
});