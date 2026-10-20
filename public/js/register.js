const form = document.getElementById("register-form");

form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("register-message");

    message.textContent = "Cadastrando...";

    if (password !== confirmPassword) {
        message.textContent = "As senhas não são iguais.";
        return;
    }

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Erro ao realizar cadastro."
            );
        }

        message.textContent =
            "Cadastro realizado com sucesso!";

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);

    } catch (error) {

        message.textContent =
            error.message || "Erro ao realizar cadastro.";

    }

});