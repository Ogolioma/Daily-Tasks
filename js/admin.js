(async function() {
  const status = document.getElementById("status");
  const list = document.getElementById("cashoutList");

  let adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    adminToken = prompt("Enter admin password:");
    if (!adminToken) {
      return (status.textContent = "Access denied: No password provided.");
    }
    localStorage.setItem("adminToken", adminToken);
  }

  async function loadCashouts() {
    list.innerHTML = "<p>Loading...</p>";
    try {
      const res = await fetch("https://daily-tasks-556b.onrender.com/api/cashout/admin", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        return location.reload();
      }
      const cashouts = await res.json();

      if (!cashouts.length) {
        list.innerHTML = "<p style='text-align:center;'>No cashout requests yet.</p>";
        return;
      }

      list.innerHTML = cashouts.map(c => `
        <div class="cashout-item ${c.status.toLowerCase()}">
          <strong>${c.amount} pts</strong> to <b>${c.accountName}</b><br/>
          Acc: ${c.accountNumber} - ${c.bank}<br/>
          <small>User: ${c.userId?.email || "N/A"} (${c.userId?.firstName || ""})</small><br/>
          <small>Requested: ${new Date(c.requestedAt).toLocaleString()}</small><br/>
          <small>Status: <b>${c.status}</b></small><br/>
          ${c.status !== "Paid" ? `<button class="approve-btn" data-id="${c._id}">Mark as Paid</button>` : ""}
        </div>
      `).join("");
    } catch (err) {
      console.error("Failed:", err);
      list.innerHTML = "<p style='color:red;'>Failed to load cashouts.</p>";
    }
  }

  list.addEventListener("click", async e => {
    if (e.target.classList.contains("approve-btn")) {
      const id = e.target.getAttribute("data-id");
      if (!confirm("Mark this cashout as paid?")) return;

      try {
        const res = await fetch(`https://daily-tasks-556b.onrender.com/api/cashout/admin/${id}/mark-paid`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (!res.ok) {
          const data = await res.json();
          return alert("Error: " + data.msg);
        }

        alert("✅ Marked as paid & user emailed!");
        loadCashouts();
      } catch (err) {
        console.error(err);
        alert("Failed to mark as paid.");
      }
    }
  });

  await loadCashouts();
})();

