document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

async function initDashboard() {
  try {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const loginTime = parseInt(localStorage.getItem("loginTime"), 10);

    // 🔒 Ensure session is valid
    if (!userString || !token || !loginTime || (Date.now() - loginTime) > (24 * 60 * 60 * 1000)) {
      alert("Your session has expired. Please log in again.");
      localStorage.clear();
      return window.location.href = "/sign-in.html";
    }

    const localUser = JSON.parse(userString);

    // 🧠 Sanity check for .id
    const userId = localUser.id || localUser._id;
    if (!userId) throw new Error("User ID missing.");

    await fetchUserData(userId, token);
    setupReferralSharing(localUser);
    setupNotificationDropdown(userId, token);
  } catch (err) {
    console.error("❌ Error during dashboard init:", err);
    alert("Couldn't load your data. Please log in again.");
    localStorage.clear();
    window.location.href = "/sign-in.html";
  }
}

function setupNotificationDropdown(userId, token) {
  const bell = document.querySelector(".notification-bell");
  const dropdown = document.getElementById("notifDropdown");
  const notifCount = document.getElementById("notifCount");

  if (!bell || !dropdown || !notifCount) return;

  bell.addEventListener("click", async () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    if (dropdown.style.display === "block") {
      try {
        await fetch(`https://daily-tasks-556b.onrender.com/api/users/${userId}/notifications/mark-read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        notifCount.textContent = "0";
      } catch (err) {
        console.error("❌ Failed to mark notifications as read:", err);
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////
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

    await loadTasks(freshUser);
    loadCashoutHistory();
  } catch (err) {
    console.error("❌ Failed to fetch user:", err);
    alert("Could not load user data.");
  }
}

function setupReferralSharing(user) {
  const refCode = user.myReferralCode;
  const link = `https://dailytasks.co/register.html?ref=${refCode}`;
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
let currentQuestions = [];

async function loadTasks(freshUser) {
  try {
    const res = await fetch("https://daily-tasks-556b.onrender.com/api/tasks");
    const tasks = await res.json();
    const container = document.getElementById("taskList");
    container.innerHTML = "";

    const localUser = JSON.parse(localStorage.getItem("user"));
    const userId = localUser.id || localUser._id;

    // === Toluna Surveys Card ===
const tolunaCard = document.createElement("div");
tolunaCard.className = "task-card";
tolunaCard.innerHTML = `
  <h4>Toluna Surveys</h4>
  <p>Complete Toluna surveys and earn points</p>
`;

// CORRECT: Capture userId in closure
tolunaCard.addEventListener("click", ((id) => () => openTolunaSurvey(id))(userId));
container.appendChild(tolunaCard);

    // === CPX Surveys Card ===
    const cpxUrl = `https://offers.cpx-research.com/index.php?app_id=28899&ext_user_id=${userId}&secure_hash=NUTVv3RBQhWcYMjYTFFcYfqh8KTJ43yc`;
    const cpxCard = document.createElement("div");
    cpxCard.className = "task-card";
    cpxCard.innerHTML = `
      <h4>CPX Surveys</h4>
      <p>Complete surveys and earn points</p>
    `;
    cpxCard.addEventListener("click", () => {
      document.getElementById("taskTitle").textContent = "CPX Surveys";
      document.getElementById("taskInstructions").innerHTML = `
        <iframe src="${cpxUrl}" style="width:100%;height:600px;border:none;"></iframe>
        <p style="margin-top:10px;color:#555;">Complete surveys to earn points. Rewards are auto-added when you finish a survey.</p>
      `;
      document.getElementById("taskModal").style.display = "flex";
    });
    container.appendChild(cpxCard);

    // === Load Database Tasks ===
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
      container.innerHTML += "<p style='text-align:center;color:#555;'>No new tasks available. Please check back later.</p>";
    } else {
      setupTaskToggle();
    }
  } catch (err) {
    console.error("❌ Failed to load tasks:", err);
  }
}

async function openTolunaSurvey(userId) {
  // === 1. Grab modal elements safely ===
  const modal = document.getElementById("taskModal");
  const title = document.getElementById("taskTitle");
  const instructions = document.getElementById("taskInstructions");
  const closeBtn = document.getElementById("closeModal");

  if (!modal || !title || !instructions) {
    console.error("Modal elements missing in DOM");
    return;
  }

  // === 2. UI setup ===
  title.textContent = "Toluna Surveys";
  instructions.innerHTML = `<p style="color:#777;">Loading surveys…</p>`;
  modal.style.display = "flex";

  let refreshTimer = null;

  // === 3. Core loader ===
  const loadSurveys = async () => {
    try {
      // ---- CREATE RESPONDENT (POST) ----
      const createRes = await fetch("https://daily-tasks-556b.onrender.com/api/toluna/create-respondent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    memberCode: userId // MUST BE "memberCode"
  })
});

      // Always parse text first to avoid JSON errors on 4xx/5xx
      const createText = await createRes.text();
      let createData;
      try { createData = JSON.parse(createText); } catch { createData = { success: false, error: createText }; }

      if (!createData.success) {
        instructions.innerHTML = `<p style="color:red;">Create Respondent failed: ${createData.error || "unknown"}</p>`;
        return;
      }

      // ---- GET SURVEYS (POST) ----
      const surveysRes = await fetch("https://daily-tasks-556b.onrender.com/api/toluna/get-surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respondentCode: userId })
      });

      const surveysText = await surveysRes.text();
      let surveysData;
      try { surveysData = JSON.parse(surveysText); } catch { surveysData = { success: false, error: surveysText }; }

      if (!surveysData.success) {
        instructions.innerHTML = `<p style="color:red;">Get Surveys failed: ${surveysData.error || "unknown"}</p>`;
        return;
      }

      const surveys = surveysData.surveys?.Surveys || [];
      if (!surveys.length) {
        instructions.innerHTML = `<p style="color:#555;text-align:center;">No surveys available right now.</p>`;
        return;
      }

      let html = `<p style="color:#444;">Available Surveys:</p>`;
      surveys.forEach(s => {
        html += `
          <div style="margin:10px 0;padding:10px;border:1px solid #ddd;border-radius:8px;">
            <strong>${s.SurveyName || "Untitled"}</strong><br>
            <span style="color:#777;">${s.EstimatedLength || "?"} min</span><br>
            <a href="${s.SurveyURL}" target="_blank" style="color:#007bff;">Start Survey</a>
          </div>`;
      });
      instructions.innerHTML = html + `<p style="margin-top:15px;font-size:13px;color:#666;text-align:center;">
        Auto-refresh every minute.
      </p>`;

    } catch (err) {
      console.error("Toluna error:", err);
      instructions.innerHTML = `<p style="color:red;">Network error: ${err.message}</p>`;
    }
  };

  // === 4. Run & auto-refresh ===
  await loadSurveys();
  refreshTimer = setInterval(loadSurveys, 60_000);

  // === 5. Close handling (null-safe) ===
  const closeModal = () => {
    modal.style.display = "none";
    if (refreshTimer) clearInterval(refreshTimer);
    instructions.innerHTML = "";
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  else console.warn("closeModal button not found – add id='closeModal'");

  // Click outside modal to close
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function setupTaskToggle() {
  const taskList = document.getElementById("taskList");
  const tasks = Array.from(taskList.children);

  if (tasks.length <= 5) return;

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

async function openTask(task) {
  selectedTaskId = task._id;

  try {
    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user"));
    const userId = localUser.id || localUser._id;

    // ✅ Fetch only the assigned questions for this user and task
    const res = await fetch(`https://daily-tasks-556b.onrender.com/api/tasks/assign-questions/${task._id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    currentQuestions = data.questions || [];

    let questionHtml = "";
    currentQuestions.forEach((q, idx) => {
      questionHtml += `
        <label style="font-size:15px;font-weight:500;margin-top:8px;">${q.question}</label>
        <input type="text" class="task-answer" data-id="${q._id}" style="display:block;width:100%;margin-bottom:10px;" />
      `;
    });

    document.getElementById("taskTitle").textContent = task.title;
    document.getElementById("taskInstructions").innerHTML = `
      <p>${task.instructions}</p>
      <a href="${task.actionLink}" target="_blank" style="color:#000080;font-weight:bold;font-size:16px;margin-top:18px;margin-bottom:18px;display:inline-block;">
        Go to Task
      </a>
      <input type="file" id="screenshotUpload" accept="image/*" required style="display:block;margin-bottom:18px;margin-top:10px;" />
      ${questionHtml}
    `;
    document.getElementById("taskModal").style.display = "flex";
  } catch (err) {
    console.error("❌ Failed to load assigned questions:", err);
    alert("Failed to load assigned questions.");
  }
}

async function submitTask() {
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user"));
  const userId = localUser.id || localUser._id;
  const fileInput = document.getElementById("screenshotUpload");
  const screenshot = fileInput.files[0];
  if (!screenshot) return alert("Please upload a screenshot.");

  const answers = [];
  document.querySelectorAll(".task-answer").forEach(input => {
    const questionId = input.dataset.id;
    const value = input.value.trim();
    answers.push({ questionId, answer: value });
  });

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

    const userRes = await fetch(`https://daily-tasks-556b.onrender.com/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const freshUser = await userRes.json();
    if (!userRes.ok) throw new Error(freshUser.msg);

    localStorage.setItem("user", JSON.stringify({ ...freshUser, id: freshUser._id }));
    drawRing(freshUser.points);
    showNotifications(freshUser);
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
    localStorage.removeItem("loginTime");
    alert("Logged out successfully.");
    window.location.href = "/sign-in.html";
  });
}
