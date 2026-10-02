const form = document.getElementById("login-form");

form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("login-message");

    message.textContent = "Entrando...";

    try {

        const response = await fetch("/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao realizar login.");
        }

        window.location.href = "/dashboard";

    } catch (error) {

        message.textContent = error.message;

    }

});