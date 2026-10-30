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

    // .message fica oculta no CSS sem a classe error/success
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
    }

    showMessage("Cadastrando...", "success");

    if (password !== confirmPassword) {
        showMessage("As senhas não são iguais.", "error");
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

        showMessage("Cadastro realizado com sucesso!", "success");

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);

    } catch (error) {

        showMessage(
            error.message || "Erro ao realizar cadastro.",
            "error"
        );

    }

});