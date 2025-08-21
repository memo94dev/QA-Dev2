document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = document.getElementById('username');
    const correoUsuario = document.getElementById('email');
    const celularUsuario = document.getElementById('celular');
    const generoUsuario = document.getElementById('genero');
    const estadoUsuario = document.getElementById('estado');

    document.getElementById('searchUserButton').addEventListener('click', async function (e) {
        e.preventDefault();

        const id = document.getElementById('id').value;
        console.log('ID ingresado:', id);
        if (id.trim() === '') {
            Swal.fire({
                icon: "warning",
                title: "ID no ingresado",
                text: "Por favor, ingresa un ID válido.",
                footer: '<p>Vuelve a intentarlo</p>'
            });
            return;
        }

        try {
            fetch(`https://desa-backend-usuario-api.onrender.com/api/Usuarios/${id}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    console.log('Datos recibidos:', data);
                    Swal.fire({
                        title: "Datos encontrados!",
                        icon: "success",
                        draggable: true,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    nombreUsuario.value = data.nombre || 'null';
                    correoUsuario.value = data.email || 'null';
                    celularUsuario.value = data.celular || 'null';
                    estadoUsuario.value = data.estado || 'null';
                    generoUsuario.value = data.genero || 'null';

                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo ha salido mal!",
                        footer: '<p>Vuelve a intentarlo más tarde</p>'
                    });
                    // Manejo de errores
                    console.error('Error en la solicitud fetch:', error);
                    nombreUsuario.value = 'Error';
                    correoUsuario.value = 'Error';
                    estadoUsuario.value = 1 || 'null';

                });
        } catch (error) {
            Swal.fire({
                title: "Error al consultar datos",
                text: "Ese problema sigue existiendo?",
                icon: "question"
            });
        }
    });
});