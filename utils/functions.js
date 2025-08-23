export function capturarDatosSesion() {
    const ua = navigator.userAgent;
    const datosParseados = parseUserAgent(ua);
    //console.log(datosParseados);

    const datos = {
        fechaHora: new Date().toISOString(),
        navegador: datosParseados.navegador,
        idioma: navigator.language,
        zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
        resolucionPantalla: `${screen.width}x${screen.height}`,
        sistemaOperativo: datosParseados.sistemaOperativo,
        dispositivo: datosParseados.dispositivo
    };

    // Geolocalización (requiere permiso del usuario)
    /*if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                datos.latitud = pos.coords.latitude;
                datos.longitud = pos.coords.longitude;

                enviarDatosAlServidor(datos);
            },
            (err) => {
                console.warn("No se pudo obtener ubicación:", err.message);
                enviarDatosAlServidor(datos);
            }
        );
    } else {
        enviarDatosAlServidor(datos);
    }*/
    enviarDatosAlServidor(datos);
    console.log('Datos de sesión capturados:', datos);
}

async function enviarDatosAlServidor(datos) {
    try {
        const res = await fetch("http://localhost/QA-Dev/backend.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        console.log("Estado HTTP:", res.status);

        const data = await res.json();
        console.log("Respuesta JSON:", data);

    } catch (err) {
        console.error("Error atrapado en catch:", err);
    }
}

function parseUserAgent(ua) {
    const info = {
        navegador: "Desconocido",
        sistemaOperativo: "Desconocido",
        dispositivo: "Desconocido"
    };

    // Navegadores
    if (/Chrome\/\d+/.test(ua) && !/Edge\/\d+/.test(ua)) {
        info.navegador = "Chrome";
    } else if (/Safari\/\d+/.test(ua) && !/Chrome\/\d+/.test(ua)) {
        info.navegador = "Safari";
    } else if (/Firefox\/\d+/.test(ua)) {
        info.navegador = "Firefox";
    } else if (/Edg\/\d+/.test(ua)) {
        info.navegador = "Edge";
    } else if (/MSIE \d+/.test(ua) || /Trident\/\d+/.test(ua)) {
        info.navegador = "Internet Explorer";
    }

    // Sistemas operativos
    if (/Windows NT/.test(ua)) {
        info.sistemaOperativo = "Windows";
    } else if (/Mac OS X/.test(ua)) {
        info.sistemaOperativo = "macOS";
    } else if (/Android/.test(ua)) {
        info.sistemaOperativo = "Android";
    } else if (/iPhone|iPad|iPod/.test(ua)) {
        info.sistemaOperativo = "iOS";
    } else if (/Linux/.test(ua)) {
        info.sistemaOperativo = "Linux";
    }

    // Dispositivo
    if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) {
        info.dispositivo = "Móvil";
    } else {
        info.dispositivo = "Escritorio";
    }

    return info;
}



// script.js

const lista = document.getElementById('cliente-lista');
const detalle = document.getElementById('cliente-detalle');
const form = document.getElementById('cliente-form');
const codigoInput = document.getElementById('cliente-codigo');

const idInput = document.getElementById('cliente-id');
const nombreInput = document.getElementById('cliente-nombre');
const emailInput = document.getElementById('cliente-email');

// Cargar lista de clientes
fetch('https://desa-backend-usuario-api.onrender.com/api/Usuarios')
    .then(res => res.json())
    .then(clientes => {
        clientes.forEach(cliente => {
            const item = document.createElement('li');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = `${cliente.nombre} (${cliente.email})`;
            item.onclick = () => cargarCliente(cliente.idUsuario);
            lista.appendChild(item);
        });
    });

// Cargar datos de un cliente
function cargarCliente(id) {
    fetch(`https://desa-backend-usuario-api.onrender.com/api/Usuarios/${id}`)
        .then(res => res.json())
        .then(cliente => {
            console.log(cliente.idUsuario);
            idInput.value = cliente.idUsuario;
            codigoInput.value = cliente.idUsuario;
            nombreInput.value = cliente.nombre;
            emailInput.value = cliente.email;
            detalle.classList.remove('d-none');
        });
}

// Guardar cambios
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = idInput.value;
    const datos = {
        nombre: nombreInput.value,
        email: emailInput.value
    };

    fetch(`https://desa-backend-usuario-api.onrender.com/api/Usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
        .then(res => res.json())
        .then(actualizado => {
            alert('Cliente actualizado correctamente');
            location.reload(); // Recarga para ver cambios
        });
});

// Verificar estado de la API
document.getElementById("verifyApi").addEventListener("click", function (e) {
    e.preventDefault();
    fetch("https://desa-backend-usuario-api.onrender.com/")
        .then(res => res.json())
        .then(data => {
            console.log("Estado de la API:", data);
            Swal.fire({
                icon: "info",
                title: "Estado de la API: " + data.estado,
                text: `Mensaje: ${data}`,
                footer: '<p>Se ha verificado la API</p>'
            });
        })
        .catch(err => console.error("Error atrapado en catch:", err));
        Swal.fire({
            icon: "error",
            title: "Error de Conexión " + data.estado,
            text: `Verificá tu conexión o intentá más tarde`,
            footer: '<p>Verificá tu conexión o intentá más tarde</p>'
        });
});