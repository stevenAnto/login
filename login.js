const API = "https://backesclavos-production.up.railway.app";
let desployar =1
const token = localStorage.getItem("token");

if (token) {
    window.location.href = "dashboard.html";
}
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}

async function handleCredentialResponse(response) {

    try {

        const googleToken = response.credential;

        const backend = await loginBackend(googleToken);

        localStorage.setItem("token", googleToken);

        localStorage.setItem(
            "user",
            JSON.stringify(backend.user)
        );

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function loginBackend(token) {

    const response = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token
        })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo autenticar");
    }

    return data;
}