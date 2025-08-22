export function capturarDatosSesion() {
    const ua = navigator.userAgent;
    const datosParseados = parseUserAgent(ua);
    console.log(datosParseados);
    
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
    if (navigator.geolocation) {
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
    }
    console.log('Datos de sesión capturados:', datos);
}

function enviarDatosAlServidor(datos) {
    fetch("/api/log_sesion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
        .then(res => res.ok ? console.log("Log enviado") : console.error("Error al enviar log"))
        .catch(err => console.error("Error de red:", err));
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