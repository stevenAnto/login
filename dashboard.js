const API = "https://backesclavos-production.up.railway.app";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    window.location.href = "index.html";
}

document.getElementById("nombre").textContent = user.name;
document.getElementById("correo").textContent = user.email;
document.getElementById("foto").src = user.picture;

document.getElementById("logout").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});

async function cargarResumen() {

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

document.getElementById("totalResumen").textContent =
    data.summary.total;

document.getElementById("registrosResumen").textContent =
    data.summary.cantidad_registros;

    } catch (error) {

        console.error(error);

    }

}

async function cargarUsuarios() {

    try {

        const response = await fetch(`${API}/records/all-summary`);

        const usuarios = await response.json();

        const tbody = document.getElementById("tablaUsuarios");

        tbody.innerHTML = "";

        const esMovil = window.matchMedia("(max-width: 768px)").matches;


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

cargarResumen();
cargarUsuarios();

document.getElementById("guardar").addEventListener("click", crearRegistro);
