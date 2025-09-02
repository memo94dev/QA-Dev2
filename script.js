import { capturarDatosSesion } from "./utils/functions.js";

document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = document.getElementById('username');
    const correoUsuario = document.getElementById('email');
    const celularUsuario = document.getElementById('celular');
    const generoUsuarioM = document.getElementById('generoMasculino');
    const generoUsuarioF = document.getElementById('generoFemenino');
    const generoUsuarioN = document.getElementById('generoNoDefinido');
    const fechaNacimientoUsuario = document.getElementById('fechaNac');
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
                footer: '<p>Vuelve a intentarlo!</p>'
            });
            return;
        }

        try {
            const response = await fetch(`https://desa-backend-usuario-api.onrender.com/api/Usuarios/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'CLAVE_API_KEY_123456'
                }
            });

            if (!response.ok) {
                // Si el usuario no existe (404), mostramos un mensaje personalizado
                if (response.status === 404) {
                    Swal.fire({
                        icon: "warning",
                        title: "Usuario no encontrado",
                        text: `No se encontró ningún usuario con el ID ${id}`,
                        footer: '<p>Verifica que el ID esté correcto!</p>'
                    });
                } else {
                    // Otros errores HTTP
                    Swal.fire({
                        icon: "error",
                        title: "Error en la consulta",
                        text: `Código de error: ${response.status}`,
                        footer: '<p>Inténtalo más tarde!</p>'
                    });
                }
                // Salimos del bloque si hubo error
                return;
            }

            const data = await response.json();

            console.log('Datos recibidos:', data);

            Swal.fire({
                icon: "success",
                title: "Datos encontrados!",
                text: `Se encontraron los datos para el ID ${id}`,
                footer: '<p>Puedes verificar que los datos sean correctos!</p>',
                showConfirmButton: false,
                timer: 1500
            });

            capturarDatosSesion();

            // Asignar los valores a los campos del formulario
            nombreUsuario.value = data.nombre || '';
            correoUsuario.value = data.email || '';
            celularUsuario.value = data.celular || '';
            fechaNacimientoUsuario.value = formatearFecha(data.fechaNacimiento) || '';
            //estadoUsuario.value = data.estado || '';

            const generoDesdeBackend = data.genero; 

            // Asignamos el valor al radio correspondiente
            if (generoDesdeBackend === 'F' || generoDesdeBackend === 'f') {
                generoUsuarioF.checked = true;
            } else if (generoDesdeBackend === 'M' || generoDesdeBackend === 'm') {
                generoUsuarioM.checked = true;
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

            // Limpieza de campos del formulario
            nombreUsuario.value = '';
            correoUsuario.value = '';
            celularUsuario.value = '';
            estadoUsuario.value = 0;
            generoUsuarioN.checked = true;
        }
    });
});

// Funcion para formatear la fecha de la BDD
function formatearFecha(fechaISO) {
  // Crea un objeto Date a partir del string ISO
  const fecha = new Date(fechaISO);

  // Extrae los componentes de la fecha
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const dia = String(fecha.getDate()).padStart(2, '0');

  // Devuelve el formato compatible con input type="date"
  return `${año}-${mes}-${dia}`;
}

// Ejemplo de uso
/*const fechaConvertida = formatearFecha("2025-09-02T09:41:57.291Z");
document.getElementById("miInputFecha").value = fechaConvertida;*/
