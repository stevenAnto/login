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

        const tbody = document.getElementById("tablaResumen");

        tbody.innerHTML = `
            <tr>
                <td>${data.summary.total}</td>
                <td>${data.summary.cantidad_registros}</td>
            </tr>
        `;

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

        usuarios.forEach(usuario => {

            tbody.innerHTML += `

                <tr>

                    <td>${usuario.name}</td>

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

cargarResumen();
cargarUsuarios();