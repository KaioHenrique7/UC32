async function loadComplaints() {

    const response = await fetch("/complaints");

    if (!response.ok) {
        return;
    }

    const complaints = await response.json();

    updateSummary(complaints);
}

function updateSummary(complaints) {

    const open = complaints.filter(
        complaint => complaint.status === "aberta"
    );

    const resolved = complaints.filter(
        complaint => complaint.status === "resolvida"
    );

    document.getElementById("total-complaints").textContent =
        complaints.length;

    document.getElementById("open-complaints").textContent =
        open.length;

    document.getElementById("resolved-complaints").textContent =
        resolved.length;
}

loadComplaints();