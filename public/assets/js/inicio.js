document.addEventListener('DOMContentLoaded', function() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/user",
        success: function(response) {
            Swal.fire({
                title: response,
                text: 'Cybermusic te da la bienvenida',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'bienvenidap',
                    title: 'bienvenidat',
                    content: 'bienvenidac'
                },
                timer: 10000
            })
        },
        error: function(xhr, textStatus, errorThrown) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                icon: 'info',
                title: 'Bienvenido, parece que no haz iniciado sesión',
                showConfirmButton: false,
                timer: 3000
            })
        }
      });;
});