document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("participantForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const selectHow = document.getElementById("selectHow").value;
    const taskTitle = document.getElementById("taskTitle").value;
    const budget = document.getElementById("budget").value;
    const company = document.getElementById("company").value;
    const enquiry = document.getElementById("enquiry").value;
    const message = document.getElementById("message").value;

    try {
      const res = await fetch("https://daily-tasks-556b.onrender.com/api/participant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          selectHow,
          taskTitle,
          budget,
          company,
          enquiry,
          message
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.msg);
        form.reset();
      } else {
        alert(data.msg || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
  });
});