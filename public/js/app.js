async function loadComplaints() {

    const response =
        await fetch("/complaints");

    const complaints =
        await response.json();

    const container =
        document.getElementById(
            "complaints-list"
        );

    container.innerHTML = "";

    complaints.forEach(complaint => {

        const card =
            document.createElement("div");

        card.className = "dashboard-card";

        card.innerHTML = `
            <h3>${complaint.title}</h3>

            <p>
                ${complaint.description}
            </p>

            <strong>
                Status:
                ${complaint.status}
            </strong>

            <br><br>

            <a href="/complaints/details.html?id=${complaint.id}">
                Ver detalhes
            </a>
        `;

        container.appendChild(card);
    });
}

loadComplaints();
