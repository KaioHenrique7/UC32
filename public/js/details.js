const detailsContainer = document.querySelector("#complaint-details");
const message = document.querySelector("#details-message");
const pathParts = window.location.pathname.split("/");
const complaintId = pathParts[pathParts.length - 1];
const statusLabels = {
    aberta: "Aberta",
    em_analise: "Em análise",
    resolvida: "Resolvida"
};
function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        };
        return characters[character];
    });
}
async function loadComplaintDetails() {
    try {
        if (!complaintId || Number.isNaN(Number(complaintId))) {
            throw new Error("Identificador da reclamação inválido.");
        }
        const response = await fetch(`/api/complaints/${complaintId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Reclamação não encontrada.");
        }
        const complaint = data.complaint;
        detailsContainer.innerHTML = `
            <h2>${escapeHtml(complaint.title)}</h2>
            <p>
                ${escapeHtml(complaint.description)}
            </p>
            <p>
                <strong>Status:</strong>
                ${statusLabels[complaint.status] || complaint.status}
            </p>
            <p>
                <strong>Data de criação:</strong>
                ${new Date(complaint.created_at).toLocaleString("pt-BR")}
            </p>
        `;
    } catch (error) {
        detailsContainer.textContent = "";
        message.textContent = error.message;
    }
}