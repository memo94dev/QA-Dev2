import { capturarDatosSesion } from "./utils/functions.js";

document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = document.getElementById('username');
    const correoUsuario = document.getElementById('email');
    const celularUsuario = document.getElementById('celular');
    const generoUsuarioM = document.getElementById('generoMasculino');
    const generoUsuarioF = document.getElementById('generoFemenino');
    const generoUsuarioN = document.getElementById('generoNoDefinido');
    const estadoUsuario = document.getElementById('estado');

    document.getElementById('searchUserButton').addEventListener('click', async function (e) {
        e.preventDefault();

        const id = document.getElementById('id').value.trim();
        console.log('ID ingresado:', id); // Verificar ID ingresado en la pantalla
        if (id === '') {
            Swal.fire({
                icon: "warning",
                title: "ID no ingresado",
                text: "Por favor, ingresa un ID válido.",
                footer: '<p>Vuelve a intentarlo</p>'
            });
            return;
        }

        try {
            const response = await fetch(`https://desa-backend-usuario-api.onrender.com/api/Usuarios/${id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                // Si el usuario no existe (404), mostramos un mensaje personalizado
                if (response.status === 404) {
                    Swal.fire({
                        icon: "warning",
                        title: "Usuario no encontrado",
                        text: `No se encontró ningún usuario con el ID ${id}`,
                        footer: '<p>Verificá que el ID esté correcto</p>'
                    });
                } else {
                    // Otros errores HTTP
                    Swal.fire({
                        icon: "error",
                        title: "Error en la consulta",
                        text: `Código de error: ${response.status}`,
                        footer: '<p>Intentalo más tarde</p>'
                    });
                }

                // Salimos del bloque si hubo error
                return;
            }

            const data = await response.json();

            //console.log('Datos recibidos:', data);

            Swal.fire({
                title: "Datos encontrados!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });

            capturarDatosSesion();

            // Asignar los valores a los campos del formulario
            nombreUsuario.value = data.nombre || '';
            correoUsuario.value = data.email || '';
            celularUsuario.value = data.celular || '';
            estadoUsuario.value = data.estado || '';

            const generoDesdeBackend = data.genero; 

            // Asignamos el valor al radio correspondiente
            if (generoDesdeBackend === 'F') {
                generoUsuarioM.checked = true;
            } else if (generoDesdeBackend === 'M') {
                generoUsuarioF.checked = true;
            } else {
                generoUsuarioN.checked = true;
            }


        } catch (error) {
            // Errores de red, CORS, etc.
            console.error('Error en la solicitud fetch:', error);

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo conectar con el servidor",
                footer: '<p>Verificá tu conexión o intentá más tarde</p>'
            });

            // Limpieza de campos si querés dejarlo claro
            nombreUsuario.value = 'null';
            correoUsuario.value = 'null';
            celularUsuario.value = 'null';
            estadoUsuario.value = 0;
            generoUsuarioN.checked = true;
        }
    });
});