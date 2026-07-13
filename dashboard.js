function parseJwt(token) {
    return JSON.parse(atob(token.split(".")[1]));
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}
const user = JSON.parse(
    localStorage.getItem("user")
);


//funcion cerrar boton
const btnLogout = document.getElementById("logout");
btnLogout.addEventListener("click",function(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
} )
const user = parseJwt(token);

document.getElementById("nombre").textContent = user.name;
document.getElementById("correo").textContent = user.email;
document.getElementById("foto").src = user.picture;