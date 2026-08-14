//const API = "https://backesclavos-production.up.railway.app";
const tabAdmin = document.getElementById("tabAdmin");
let grafico = null;
const API = "https://registros.esclavos.cc";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const ADMIN_EMAIL = "ecalcinap@unsa.edu.pe";

if (user.email === ADMIN_EMAIL) {
    tabAdmin.style.display = "inline-block";
}


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
const panelAdmin = document.getElementById("panelAdmin");

tabUsuarios.addEventListener("click", () => {

    panelUsuarios.style.display = "block";
    panelRegistros.style.display = "none";
    panelAdmin.style.display = "none";

});

tabRegistros.addEventListener("click", () => {

    panelUsuarios.style.display = "none";
    panelRegistros.style.display = "block";
    panelAdmin.style.display = "none";

    cargarRegistros();

});
tabAdmin.addEventListener("click", () => {

    panelUsuarios.style.display = "none";
    panelRegistros.style.display = "none";
    panelAdmin.style.display = "block";

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
        cargarRegistros();

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
        const registrosOrdenados = [...data.records].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const resumen = agruparRegistrosPorDia(registrosOrdenados);

        const labels = Object.keys(resumen);

        const valores = Object.values(resumen);

        console.log(labels);

        console.log(valores);

        dibujarGrafico(labels, valores);

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

function agruparRegistrosPorDia(registros) {

    const resumen = {};

    registros.forEach(registro => {

        const fecha = new Date(registro.created_at + "Z");

        const dia = fecha.toLocaleDateString("es-PE", {
            timeZone: "America/Lima"
        });

        if (!resumen[dia]) {
            resumen[dia] = 0;
        }

        resumen[dia] += registro.value;

    });

    return resumen;

}
function dibujarGrafico(labels, valores) {

    const ctx = document
        .getElementById("graficoHistorial")
        .getContext("2d");

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [
                {

                    label: "Total registrado por día",

                    data: valores,

                    borderWidth: 2,

                    tension: 0.3,

                    fill: false

                }
            ]

        },

        options: {
            animation: false,

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Fecha"

                    }

                },

                y: {

                    title: {

                        display: true,

                        text: "Valor"

                    },

                    beginAtZero: false

                }

            }

        }

    });

}

async function buscarRegistrosAdmin() {

    const email = document
        .getElementById("emailAdmin")
        .value
        .trim();

    if (!email) {
        alert("Ingrese un correo electrónico");
        return;
    }

    try {

        const response = await fetch(
            `${API}/records/history?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        console.log("Registros admin:", data);

        if (!response.ok) {
            alert(data.detail || "Usuario no encontrado");
            return;
        }

        mostrarRegistrosAdmin(data.records);

    } catch (error) {

        console.error(error);

        alert("Error al obtener los registros");

    }
}

function mostrarRegistrosAdmin(records) {

    const tbody = document.getElementById("tablaAdmin");

    tbody.innerHTML = "";

    records.forEach(registro => {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${formatearFecha(registro.created_at)}
                </td>

                <td>
                    <input
                        type="number"
                        id="valor-${registro._id}"
                        value="${registro.value}"
                        style="width: 80px;"
                    >
                </td>

                <td>
                    <button
                        onclick="modificarValor('${registro._id}')"
                    >
                        Guardar
                    </button>
                </td>

            </tr>
        `;

    });

}
async function modificarValor(recordId) {

    const input = document.getElementById(
        `valor-${recordId}`
    );

    const value = Number(input.value);

    if (isNaN(value)) {
        alert("Ingrese un valor válido");
        return;
    }

    try {

        const response = await fetch(
            `${API}/records/${recordId}/value`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    value: value
                })
            }
        );

        const data = await response.json();

        console.log("PATCH:", data);

        if (!response.ok) {
            alert(data.detail || "Error al modificar");
            return;
        }

        alert("Valor actualizado correctamente");

    } catch (error) {

        console.error(error);

        alert("Error al modificar el registro");

    }
}

cargarResumen();
cargarUsuarios();

document.getElementById("guardar").addEventListener("click", crearRegistro);

