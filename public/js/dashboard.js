async function loadUser() {

    const response = await fetch("/api/user/me");

    if (!response.ok) {
        window.location.href = "/login";
        return;
    }

    const user = await response.json();

    document.getElementById("user-name").textContent =
        user.name;
}
