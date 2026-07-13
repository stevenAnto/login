function parseJwt(token) {
    return JSON.parse(atob(token.split(".")[1]));
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const user = parseJwt(token);

document.getElementById("nombre").textContent = user.name;
document.getElementById("correo").textContent = user.email;
document.getElementById("foto").src = user.picture;