
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#loginForm");
    const message = document.querySelector("#message");
  
    if (!form) return;
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
  
      if (!email || !password) {
        showMessage("Preencha todos os campos.", "error");
        return;
      }
  
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
  
      button.disabled = true;
      button.textContent = "Entrando...";
  
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "E-mail ou senha inválidos.");
        }
  
        showMessage("Login realizado com sucesso!", "success");
  
        // Ajuste esta rota conforme o backend do projeto.
        window.location.href = "/dashboard";
      } catch (error) {
        showMessage(
          error.message || "Não foi possível conectar ao servidor.",
          "error"
        );
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  
    function showMessage(text, type) {
      if (!message) return;
  
      message.textContent = text;
      message.className = `message ${type}`;
    }
  });
  