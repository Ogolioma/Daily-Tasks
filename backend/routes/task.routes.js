const express = require("express");
const router = express.Router();
const Task = require("../model/Task");
const User = require("../model/user");
const Proof = require("../model/proof");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const sendMail = require("../utils/sendMail"); // ✅ import your mailer

// ------------------ GET ALL TASKS ------------------
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err);
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
});

// ------------------ SUBMIT TASK ------------------
router.post("/submit", auth, upload.single("screenshot"), async (req, res) => {
  try {
    console.log("🚀 FILE RECEIVED:", req.file);
    console.log("📦 BODY:", req.body);

    const { taskId, answers } = req.body;
    if (!taskId) return res.status(400).json({ msg: "Task ID missing." });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ msg: "Task already completed." });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: "Screenshot upload failed." });
    }

    // ✅ Answers validation
    if (task.questions && task.questions.length > 0) {
      let parsedAnswers = [];
      try {
        parsedAnswers = JSON.parse(answers || "[]");
      } catch (e) {
        return res.status(400).json({ msg: "Invalid answers format." });
      }

      for (let i = 0; i < task.questions.length; i++) {
        const expected = (task.questions[i].answer || "").trim().toLowerCase();
        const provided = (parsedAnswers[i] || "").trim().toLowerCase();
        if (expected && expected !== provided) {
          return res.status(400).json({ msg: `Answer to question ${i+1} is incorrect.` });
        }
      }
    }

    // ✅ Update user
    user.points += task.points;
    user.completedTasks.push(taskId);
    user.notifications.push({
      message: `You completed "${task.title}" and earned ${task.points} points.`,
    });

    await user.save();

    // ✅ Save proof
    const proof = new Proof({
      user: user._id,
      email: user.email,
      task: task._id,
      screenshotUrl: req.file.path,
      pointsAwarded: task.points
    });
    await proof.save();

    res.json({
      msg: "Task submitted!",
      points: user.points,
      screenshotUrl: req.file.path,
    });

  } catch (err) {
    console.error("❌ Task submit error:", err);
    res.status(500).json({ msg: "Error submitting task", error: err.message });
  }
});

// ------------------ ADD NEW TASK ------------------
router.post("/add", async (req, res) => {
  try {
    const { title, instructions, points, actionLink, questions } = req.body;
    const task = await Task.create({ title, instructions, points, actionLink, questions });

    // ✅ notify all users by email
    const users = await User.find({}, "email firstName");
    for (const user of users) {
      await sendMail(
        user.email,
        "🆕 New Task Available on Daily Tasks!",
        `
          <div style="font-family:sans-serif;">
            <h2>Hello ${user.firstName || ''},</h2>
            <p>A new task <strong>"${title}"</strong> has been added to your dashboard.</p>
            <p>Log in now to complete it and earn ${points} points.</p>
            <a href="https://dailytasks.co/sign-in.html" style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
              Go to Dashboard
            </a>
          </div>
        `
      );
      console.log(`📧 Sent new task email to ${user.email}`);
    }

    res.json({ msg: "Task added & notifications sent!", task });
  } catch (err) {
    console.error("❌ Add task error:", err);
    res.status(500).json({ msg: "Error adding task" });
  }
});

module.exports = router;