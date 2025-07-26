console.log("register.js loaded")
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const daySelect = document.getElementById("dob-day");
  const yearSelect = document.getElementById("dob-year");

  // NEW: capture referral from URL
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    const referralInput = document.getElementById("referral");
    if (referralInput) {
      referralInput.value = ref;
    }
    console.log("Referral code loaded from URL:", ref);
  }

  // Populate day options
  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    daySelect.appendChild(opt);
  }

  // Populate year options
  for (let y = 2014; y >= 1950; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  if (!form) return;

  console.log("Form ready for submission")
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      gender: document.getElementById("gender").value,
      dob: `${document.getElementById("dob-day").value} ${document.getElementById("dob-month").value} ${document.getElementById("dob-year").value}`,
      occupation: document.getElementById("occupation").value,
      nationality: document.getElementById("nationality").value,
      heard: document.getElementById("heard").value,
      referralCode: document.getElementById("referral").value
    };

    try {
      const res = await fetch("https://daily-tasks-556b.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        alert(result.msg);
        window.location.href = "register-thank-you.html";
      } else {
        alert(result.msg || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  });
});


