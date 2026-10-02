const form = document.getElementById("login-form");

form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("login-message");

    message.textContent = "Entrando...";

});