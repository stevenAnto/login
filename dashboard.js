//const API = "https://backesclavos-production.up.railway.app";
const API = "https://registros.esclavos.cc";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || tokenExpirado(token)) {

    cerrarSesion();

}

document.getElementById("nombre").textContent = user.name;
document.getElementById("correo").textContent = user.email;
document.getElementById("foto").src = user.picture;

document.getElementById("logout").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});

const tabUsuarios = document.getElementById("tabUsuarios");
const tabRegistros = document.getElementById("tabRegistros");

const panelUsuarios = document.getElementById("panelUsuarios");
const panelRegistros = document.getElementById("panelRegistros");

tabUsuarios.addEventListener("click", () => {

    panelUsuarios.style.display = "block";
    panelRegistros.style.display = "none";

});

tabRegistros.addEventListener("click", () => {

    panelUsuarios.style.display = "none";
    panelRegistros.style.display = "block";

    cargarRegistros();

});

async function cargarResumen() {
    if (tokenExpirado(token)) {
        cerrarSesion();
        return;
    }

    try {

        const response = await fetch(`${API}/records/summary`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: token
            })

        });

        const data = await response.json();
        console.log("Recibod summary ",data);

        document.getElementById("totalResumen").textContent =
            data.summary.total;

        document.getElementById("registrosResumen").textContent =
            data.summary.cantidad_registros;

    } catch (error) {

        console.error(error);

    }

}

async function cargarUsuarios() {
    if (tokenExpirado(token)) {
        cerrarSesion();
        return;
    }

    try {

        const response = await fetch(`${API}/records/all-summary`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        });

        const usuarios = await response.json();
        console.log("Usuarios:", usuarios);

        const tbody = document.getElementById("tablaUsuarios");

        tbody.innerHTML = "";

        const esMovil = window.matchMedia("(max-width: 768px)").matches;
        usuarios.sort((a, b) => b.total - a.total);//ordenado


        usuarios.forEach(usuario => {

            const nombreMostrar = esMovil
                ? usuario.name.split(" ")[0]
                : usuario.name;

            tbody.innerHTML += `
        <tr>
            <td>${nombreMostrar}</td>
            <td>${usuario.email}</td>
            <td>${usuario.total}</td>
            <td>${usuario.cantidad_registros}</td>
        </tr>
    `;

        });

    } catch (error) {

        console.error(error);

    }

}

async function crearRegistro() {
    if (tokenExpirado(token)) {
        cerrarSesion();
        return;
    }

    const value = Number(
        document.getElementById("valor").value
    );

    if (isNaN(value)) {

        alert("Ingrese un valor válido");

        return;
    }

    try {

        const response = await fetch(`${API}/records`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                token: token,
                value: value

            })

        });

        const data = await response.json();

        console.log(data);

        document.getElementById("valor").value = "";

        // Actualizar tablas
        cargarResumen();
        cargarUsuarios();

    } catch (error) {

        console.error(error);

        alert("Error al guardar el registro.");

    }

}
function cerrarSesion() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

}

function tokenExpirado(token) {

    try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        // exp está en segundos desde 1970
        const ahora = Math.floor(Date.now() / 1000);

        return payload.exp <= ahora;

    } catch (error) {

        return true;

    }

}
function obtenerExpiracionToken(token) {

    const payload = JSON.parse(atob(token.split(".")[1]));

    return new Date(payload.exp * 1000);

}
const fecha = obtenerExpiracionToken(token);

console.log(
    fecha.toLocaleString("es-PE", {
        timeZone: "America/Lima"
    })
);
async function cargarRegistros() {

    if (tokenExpirado(token)) {
        cerrarSesion();
        return;
    }

    try {

        const response = await fetch(`${API}/records/history`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: token
            })

        });

        const data = await response.json();

        console.log("Historial:", data);

        const tbody = document.getElementById("tablaRegistros");

        tbody.innerHTML = "";

        data.records.forEach(registro => {

            tbody.innerHTML += `
                <tr>
                    <td>${formatearFecha(registro.created_at)}</td>
                    <td>${registro.value}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}
function formatearFecha(fechaUTC) {

    const fecha = new Date(fechaUTC + "Z");

    return fecha.toLocaleString("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

}

cargarResumen();
cargarUsuarios();

document.getElementById("guardar").addEventListener("click", crearRegistro);
