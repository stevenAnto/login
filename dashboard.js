const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "index.html";

}

// Botón cerrar sesión
const btnLogout = document.getElementById("logout");

btnLogout.addEventListener("click", function () {

    localStorage.removeItem("token");

    window.location.href = "index.html";

});