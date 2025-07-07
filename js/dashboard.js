document.addEventListener("DOMContentLoaded", () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!localUser || !token) {
    alert("You must be logged in.");
    return (window.location.href = "/sign-in.html");
  }

  fetchUserData(localUser.id, token);
  setupReferralSharing(localUser);

  document.querySelector(".notification-bell").addEventListener("click", async () => {
    const dropdown = document.getElementById("notifDropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

    if (dropdown.style.display === "block") {
      try {
        await fetch(`https://daily-tasks-556b.onrender.com/api/users/${localUser.id}/notifications/mark-read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
        document.getElementById("notifCount").textContent = "0";
      } catch (err) {
        console.error("❌ Failed to mark notifications as read:", err);
      }
    }
  });
});

function showNotifications(user) {
  const list = document.getElementById("notifList");
  list.innerHTML = "";

  if (user.notifications && user.notifications.length > 0) {
    user.notifications.slice(-5).reverse().forEach((notif) => {
      const li = document.createElement("li");
      li.textContent = notif.message;
      list.appendChild(li);
    });
    document.getElementById("notifCount").textContent =
      user.notifications.filter((n) => !n.read).length;
  } else {
    const li = document.createElement("li");
    li.textContent = "No notifications yet.";
    list.appendChild(li);
  }
}

async function fetchUserData(userId, token) {
  try {
    const res = await fetch(`https://daily-tasks-556b.onrender.com/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const freshUser = await res.json();
    if (!res.ok) throw new Error(freshUser.msg);

    document.getElementById("welcomeName").textContent = freshUser.firstName;
    document.getElementById("userEmail").textContent = freshUser.email;
    document.getElementById("userPhone").textContent = freshUser.phone || "N/A";
    document.getElementById("userReferral").textContent = freshUser.myReferralCode || "N/A";

    drawRing(freshUser.points);
    localStorage.setItem("user", JSON.stringify(freshUser));
    showNotifications(freshUser);

    await loadTasks(freshUser); // await to ensure tasks loaded before next
    loadCashoutHistory();
  } catch (err) {
    console.error("❌ Failed to fetch user:", err);
    alert("Could not load user data.");
  }
}

function setupReferralSharing(user) {
  const refCode = user.myReferralCode;
  const link = `https://daily-tasks-556b.onrender.com/register.html?ref=${refCode}`;
  const msg = encodeURIComponent(`Join Daily Tasks and earn points! Use my referral: ${link}`);

  document.getElementById("shareBtn").addEventListener("click", () => {
    document.getElementById("socialIcons").style.display = "flex";
    document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${msg}`;
    document.getElementById("shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    document.getElementById("shareTwitter").href = `https://twitter.com/intent/tweet?text=${msg}`;
    document.getElementById("shareInstagram").href = `https://www.instagram.com/`;
  });

  document.getElementById("copyLink").addEventListener("click", () => {
    navigator.clipboard.writeText(link);
    alert("Referral link copied!");
  });
}

let selectedTaskId = null;

async function loadTasks(freshUser) {
  try {
    const res = await fetch("https://daily-tasks-556b.onrender.com/api/tasks");
    const tasks = await res.json();
    const container = document.getElementById("taskList");
    container.innerHTML = "";

    let hasTasks = false;
    tasks.forEach((task) => {
      if (freshUser.completedTasks.includes(task._id)) return;

      hasTasks = true;
      const card = document.createElement("div");
      card.className = "task-card";
      card.dataset.taskId = task._id;
      card.innerHTML = `
        <h4>${task.title}</h4>
        <p class="task-points">+${task.points} pts</p>
        <p>Click to see task instructions</p>
      `;
      card.addEventListener("click", () => openTask(task));
      container.appendChild(card);
    });

    if (!hasTasks) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No new tasks available. Please check back later.</p>";
    } else {
      setupTaskToggle(); // ✅ ONLY call toggle after tasks loaded
    }
  } catch (err) {
    console.error("❌ Failed to load tasks:", err);
  }
}

function setupTaskToggle() {
  const taskList = document.getElementById("taskList");
  const tasks = Array.from(taskList.children);

  if (tasks.length <= 5) return;

  // Create toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Show All Tasks ▼";
  Object.assign(toggleBtn.style, {
    margin: "10px auto", display: "block", padding: "10px 20px",
    backgroundColor: "#000080", color: "#fff", border: "none",
    borderRadius: "6px", cursor: "pointer", fontWeight: "600"
  });

  let showingAll = false;
  tasks.forEach((task, index) => {
    if (index >= 5) task.style.display = "none";
  });

  toggleBtn.addEventListener("click", () => {
    if (showingAll) {
      tasks.forEach((task, index) => task.style.display = index < 5 ? "flex" : "none");
      toggleBtn.textContent = "Show All Tasks ▼";
    } else {
      tasks.forEach(task => task.style.display = "flex");
      toggleBtn.textContent = "Collapse Tasks ▲";
    }
    showingAll = !showingAll;
  });

  taskList.parentElement.appendChild(toggleBtn);
}

function openTask(task) {
  selectedTaskId = task._id;

  let questionHtml = "";
  if (task.questions && task.questions.length > 0) {
    questionHtml = "<h4>Answer these questions:</h4>";
    task.questions.forEach((q, idx) => {
      questionHtml += `
        <label style="font-size:15px;font-weight:500;margin-top:8px;">${q.question}</label>
        <input type="text" class="task-answer" data-idx="${idx}" style="display:block;width:100%;margin-bottom:10px;">
      `;
    });
  }

  document.getElementById("taskTitle").textContent = task.title;
  document.getElementById("taskInstructions").innerHTML = `
    <p>${task.instructions}</p>
    <a href="${task.actionLink}" target="_blank" style="color:#000080;font-weight:bold;font-size:16px;margin-top:10px;display:inline-block;">
      Go to Task
    </a>
    <input type="file" id="screenshotUpload" accept="image/*" required style="display:block;margin-top:10px;" />
    ${questionHtml}
  `;
  document.getElementById("taskModal").style.display = "flex";
}

async function submitTask() {
  const token = localStorage.getItem("token");
  const fileInput = document.getElementById("screenshotUpload");
  const screenshot = fileInput.files[0];
  if (!screenshot) return alert("Please upload a screenshot.");

  const answers = [];
  document.querySelectorAll(".task-answer").forEach(input => answers.push(input.value.trim()));

  const formData = new FormData();
  formData.append("taskId", selectedTaskId);
  formData.append("screenshot", screenshot);
  formData.append("answers", JSON.stringify(answers));

  try {
    const res = await fetch("https://daily-tasks-556b.onrender.com/api/tasks/submit", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg);

    alert(data.msg);
    closeModal();

    document.querySelectorAll(".task-card").forEach(card => {
      if (card.dataset.taskId === selectedTaskId) card.remove();
    });

    const container = document.getElementById("taskList");
    if (!container.querySelector(".task-card")) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No new tasks available. Please check back later.</p>";
    }
  } catch (err) {
    console.error("❌ Submission failed:", err);
    alert(err.message || "Could not submit task.");
  }
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

async function loadCashoutHistory() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("cashoutHistoryContainer");

  try {
    const res = await fetch("https://daily-tasks-556b.onrender.com/api/cashout/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const history = await res.json();

    if (!history.length) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No cashouts yet.</p>";
    } else {
      container.innerHTML = history.map(c => `
        <div class="cashout-item" style="background:#f0f2f5;margin:10px 0;padding:10px;border-left:4px solid ${c.status === "Paid" ? "green" : "orange"};border-radius:6px;">
          <div><strong>${c.amount} pts</strong> - 
            <span class="status ${c.status === 'Paid' ? 'paid' : 'pending'}">
              ${c.status === 'Paid' ? '✅ Paid' : '🕒 Pending'}
            </span>
          </div>
          <small>${new Date(c.requestedAt).toLocaleString()}</small>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("❌ Failed to load cashout history:", err);
    container.innerHTML = "<p style='color:red;'>Could not load history.</p>";
  }
}

function drawRing(points) {
  const canvas = document.getElementById("earningsRing");
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 50;
  const percent = Math.min(points / 1000, 1);
  const angle = percent * 2 * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ccc"; ctx.lineWidth = 12; ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI/2, angle - Math.PI/2);
  ctx.strokeStyle = points >= 1000 ? "green" : points > 500 ? "orange" : "red";
  ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.stroke();

  ctx.font = "bold 18px Segoe UI";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${points} pts`, centerX, centerY);

  document.getElementById("cashout-btn").disabled = points < 1000;
}

document.getElementById("cashout-btn").addEventListener("click", () => {
  window.location.href = "/cash-out.html";
});
document.getElementById("viewHistoryBtn").addEventListener("click", async () => {
  const container = document.getElementById("cashoutHistoryContainer");
  if (container.style.display === "none" || container.style.display === "") {
    await loadCashoutHistory();
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully.");
    window.location.href = "/sign-in.html";
  });
}



/*document.addEventListener("DOMContentLoaded", () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!localUser || !token) {
    alert("You must be logged in.");
    return (window.location.href = "/sign-in.html");
  }

  fetchUserData(localUser.id, token);
  setupReferralSharing(localUser);

  document.querySelector(".notification-bell").addEventListener("click", async () => {
    const dropdown = document.getElementById("notifDropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

    if (dropdown.style.display === "block") {
      try {
        await fetch(`http://localhost:5000/api/users/${localUser.id}/notifications/mark-read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
        document.getElementById("notifCount").textContent = "0";
      } catch (err) {
        console.error("❌ Failed to mark notifications as read:", err);
      }
    }
  });
});

function showNotifications(user) {
  const list = document.getElementById("notifList");
  list.innerHTML = "";

  if (user.notifications && user.notifications.length > 0) {
    user.notifications.slice(-5).reverse().forEach((notif) => {
      const li = document.createElement("li");
      li.textContent = notif.message;
      list.appendChild(li);
    });

    document.getElementById("notifCount").textContent =
      user.notifications.filter((n) => !n.read).length;
  } else {
    const li = document.createElement("li");
    li.textContent = "No notifications yet.";
    list.appendChild(li);
  }
}

async function fetchUserData(userId, token) {
  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const freshUser = await res.json();
    if (!res.ok) throw new Error(freshUser.msg);

    document.getElementById("welcomeName").textContent = freshUser.firstName;
    document.getElementById("userEmail").textContent = freshUser.email;
    document.getElementById("userPhone").textContent = freshUser.phone || "N/A";
    document.getElementById("userReferral").textContent = freshUser.myReferralCode || "N/A";

    drawRing(freshUser.points);
    localStorage.setItem("user", JSON.stringify(freshUser));
    showNotifications(freshUser);

    loadTasks(freshUser);
    loadCashoutHistory();
  } catch (err) {
    console.error("❌ Failed to fetch user:", err);
    alert("Could not load user data.");
  }
}

function setupReferralSharing(user) {
  const refCode = user.myReferralCode;
  const link = `http://localhost:5500/register.html?ref=${refCode}`;
  const msg = encodeURIComponent(`Join Daily Tasks and earn points! Use my referral: ${link}`);

  document.getElementById("shareBtn").addEventListener("click", () => {
    document.getElementById("socialIcons").style.display = "flex";
    document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${msg}`;
    document.getElementById("shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    document.getElementById("shareTwitter").href = `https://twitter.com/intent/tweet?text=${msg}`;
    document.getElementById("shareInstagram").href = `https://www.instagram.com/`;
  });

  document.getElementById("copyLink").addEventListener("click", () => {
    navigator.clipboard.writeText(link);
    alert("Referral link copied!");
  });
}

let selectedTaskId = null;

async function loadTasks(freshUser) {
  try {
    const res = await fetch("http://localhost:5000/api/tasks");
    const tasks = await res.json();
    const container = document.getElementById("taskList");
    container.innerHTML = "";

    let hasTasks = false;
    tasks.forEach((task) => {
      if (freshUser.completedTasks.includes(task._id)) return;

      hasTasks = true;
      const card = document.createElement("div");
      card.className = "task-card";
      card.dataset.taskId = task._id;
      card.innerHTML = `
        <h4>${task.title}</h4>
        <p class="task-points">+${task.points} pts</p>
        <p>Click to see task instructions</p>
      `;
      card.addEventListener("click", () => openTask(task));
      container.appendChild(card);
    });

    if (!hasTasks) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No new tasks available. Please check back later.</p>";
    }
  } catch (err) {
    console.error("❌ Failed to load tasks:", err);
  }
}

function openTask(task) {
  selectedTaskId = task._id;

  let questionHtml = "";
  if (task.questions && task.questions.length > 0) {
    questionHtml = "<h4>Answer these questions:</h4>";
    task.questions.forEach((q, idx) => {
      questionHtml += `
        <label style="font-size:15px;font-weight:500;margin-top:8px;">${q.question}</label>
        <input type="text" class="task-answer" data-idx="${idx}" style="display:block;width:100%;margin-bottom:10px;">
      `;
    });
  }

  document.getElementById("taskTitle").textContent = task.title;
  document.getElementById("taskInstructions").innerHTML = `
    <p>${task.instructions}</p>
    <a href="${task.actionLink}" target="_blank" style="color:#000080;font-weight:bold;font-size:16px;margin-top:10px;display:inline-block;">
      Go to Task
    </a>
    <input type="file" id="screenshotUpload" accept="image/*" required style="display:block;margin-top:10px;" />
    ${questionHtml}
  `;
  document.getElementById("taskModal").style.display = "flex";
}

async function submitTask() {
  const token = localStorage.getItem("token");
  const fileInput = document.getElementById("screenshotUpload");
  const screenshot = fileInput.files[0];
  if (!screenshot) return alert("Please upload a screenshot.");

  const answers = [];
  document.querySelectorAll(".task-answer").forEach(input => answers.push(input.value.trim()));

  const formData = new FormData();
  formData.append("taskId", selectedTaskId);
  formData.append("screenshot", screenshot);
  formData.append("answers", JSON.stringify(answers));

  try {
    const res = await fetch("http://localhost:5000/api/tasks/submit", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg);

    alert(data.msg);
    closeModal();

    document.querySelectorAll(".task-card").forEach(card => {
      if (card.dataset.taskId === selectedTaskId) card.remove();
    });

    const container = document.getElementById("taskList");
    if (!container.querySelector(".task-card")) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No new tasks available. Please check back later.</p>";
    }

    const localUser = JSON.parse(localStorage.getItem("user"));
    fetchUserData(localUser.id, token);
  } catch (err) {
    console.error("❌ Submission failed:", err);
    alert(err.message || "Could not submit task.");
  }
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}


async function loadCashoutHistory() {
  const token = localStorage.getItem("token");
  const container = document.getElementById("cashoutHistoryContainer");

  try {
    const res = await fetch("http://localhost:5000/api/cashout/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const history = await res.json();

    if (!history.length) {
      container.innerHTML = "<p style='text-align:center;color:#555;'>No cashouts yet.</p>";
    } else {
      container.innerHTML = history.map(c => `
        <div class="cashout-item" style="background:#f0f2f5;margin:10px 0;padding:10px;border-left:4px solid ${c.status === "Paid" ? "green" : "orange"};border-radius:6px;">
          <div><strong>${c.amount} pts</strong> - 
            <span class="status ${c.status === 'Paid' ? 'paid' : 'pending'}">
              ${c.status === 'Paid' ? '✅ Paid' : '🕒 Pending'}
            </span>
          </div>
          <small>${new Date(c.requestedAt).toLocaleString()}</small>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("❌ Failed to load cashout history:", err);
    container.innerHTML = "<p style='color:red;'>Could not load history.</p>";
  }
}

function drawRing(points) {
  const canvas = document.getElementById("earningsRing");
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 50;
  const percent = Math.min(points / 1000, 1);
  const angle = percent * 2 * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ccc"; ctx.lineWidth = 12; ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI/2, angle - Math.PI/2);
  ctx.strokeStyle = points >= 1000 ? "green" : points > 500 ? "orange" : "red";
  ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.stroke();

  ctx.font = "bold 18px Segoe UI";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${points} pts`, centerX, centerY);

  document.getElementById("cashout-btn").disabled = points < 1000;
}

document.getElementById("cashout-btn").addEventListener("click", () => {
  window.location.href = "/cash-out.html";
});
document.getElementById("viewHistoryBtn").addEventListener("click", async () => {
  const container = document.getElementById("cashoutHistoryContainer");
  if (container.style.display === "none" || container.style.display === "") {
    await loadCashoutHistory();
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
});


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully.");
    window.location.href = "/sign-in.html";
  });
}*/