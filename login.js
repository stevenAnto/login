// const API = "http://66.154.117.158:8000";
let desployar =1
const token = localStorage.getItem("token");

if (token) {
    window.location.href = "dashboard.html";
}


function handleCredentialResponse(response) {

    const googleToken = response.credential;

    const user = parseJwt(googleToken);

    localStorage.setItem("token", googleToken);
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "dashboard.html";
}

// async function loginBackend(token) {

//     const response = await fetch(`${API}/auth/google`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             token: token
//         })
//     });

//     return await response.json();
// }