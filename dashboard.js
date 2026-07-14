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

        console.log("Respuesta backend:", data);

    } catch (error) {

        console.error(error);

    }

}

cargarResumen()