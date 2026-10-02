async function loadComplaints() {

    const response = await fetch("/complaints");

    if (!response.ok) {
        return;
    }

    const complaints = await response.json();

    updateSummary(complaints);
}

loadComplaints();