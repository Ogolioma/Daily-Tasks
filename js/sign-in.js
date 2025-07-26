//sign-in.js
function toggleVisibility(inputId, iconSpan) {
  const input = document.getElementById(inputId);
  const icon = iconSpan.querySelector("ion-icon");

  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("name", "eye-off-outline");
  } else {
    input.type = "password";
    icon.setAttribute("name", "eye-outline");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signInForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("https://daily-tasks-556b.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed.");
        return;
      }

      // ✅ Save user info, token, and loginTime (for 24-hour session control)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now());

      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});