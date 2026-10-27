async function loadComplaints() {
    const container =
        document.getElementById("complaints-list");

    if (!container) {
        return;
    }

    try {
        const response = await fetch("/api/complaints", {
            headers: {
                Accept: "application/json"
            }
        });

        if (response.status === 401) {
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao carregar reclamações.");
        }

        const complaints = await response.json();

        container.replaceChildren();

        if (complaints.length === 0) {
            container.textContent =
                "Nenhuma reclamação encontrada.";
            return;
        }

        complaints.forEach((complaint) => {
            const card = document.createElement("div");
            card.className = "dashboard-card";

            const title = document.createElement("h3");
            title.textContent = complaint.title;

            const description = document.createElement("p");
            description.textContent = complaint.description;

            const status = document.createElement("strong");
            status.textContent = `Status: ${complaint.status}`;

            const link = document.createElement("a");
            link.href =
                `/complaints/details?id=${complaint.id}`;
            link.textContent = "Ver detalhes";

            card.append(
                title,
                description,
                status,
                document.createElement("br"),
                document.createElement("br"),
                link
            );

            container.appendChild(card);
        });
    } catch (error) {
        container.textContent =
            "Não foi possível carregar as reclamações.";
        console.error(error);
    }
}

loadComplaints();