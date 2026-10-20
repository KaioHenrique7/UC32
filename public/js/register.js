const form = document.getElementById("register-form");

form?.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("register-message");

    message.textContent = "Cadastrando...";

});
