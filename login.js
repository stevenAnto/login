const token = localStorage.getItem("token");

if (token) {
    window.location.href = "dashboard.html";
}


function handleCredentialResponse(response) {

    const googleToken = response.credential;


    loginBackend(googleToken)
        .then(data => {

            if(data.success){

                console.log("Usuario:", data.user);


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                window.location.href="dashboard.html";

            }

        });

}

async function loginBackend(token) {

    const response = await fetch(
        "http://127.0.0.1:8000/auth/google",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: token
            })
        }
    );


    const data = await response.json();

    console.log(data);

    return data;
}