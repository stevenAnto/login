const token = localStorage.getItem("token");

if (token) {
    window.location.href = "dashboard.html";
}


function handleCredentialResponse(response) {

    // Guardar el ID Token
    localStorage.setItem("token", response.credential);

    console.log("Token guardado.");

    // Ir al dashboard
    window.location.href = "dashboard.html";

}