const express = require("express");
const router = express.Router();
const Task = require("../model/Task");
const User = require("../model/user");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

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

    // ✅ Response
    res.json({
      msg: "Task submitted!",
      points: user.points,
      screenshotUrl: req.file.path, // cloudinary URL
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

    res.json({ msg: "Task added!", task });
  } catch (err) {
    console.error("❌ Add task error:", err);
    res.status(500).json({ msg: "Error adding task" });
  }
});

module.exports = router;

/*const express = require("express");
const router = express.Router();
const Task = require("../model/Task");
const User = require("../model/user");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");
const sendMail = require("../utils/sendMail");

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

    if (!req.file?.path) {
      return res.status(400).json({ msg: "Screenshot upload failed." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `screenshots/${user.firstName}-${user._id}`,
      context: `user=${user.firstName},email=${user.email}`
    });
    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Validate answers if there are questions
    if (task.questions && task.questions.length > 0) {
      let parsedAnswers = [];
      try {
        parsedAnswers = JSON.parse(answers || "[]");
        console.log("✅ Parsed Answers:", parsedAnswers);
      } catch (e) {
        console.error("❌ JSON parse failed:", e);
        return res.status(400).json({ msg: "Invalid answers format." });
      }

      for (let i = 0; i < task.questions.length; i++) {
        const expected = (task.questions[i].answer || "").trim().toLowerCase();
        const provided = (parsedAnswers[i] || "").trim().toLowerCase();
        if (expected && expected !== provided) {
          return res.status(400).json({ msg: `Answer to question ${i + 1} is incorrect.` });
        }
      }
    }

    // Save task completion
    user.points += task.points;
    user.completedTasks.push(taskId);
    user.notifications.push({
      message: `You completed "${task.title}" and earned ${task.points} points.`,
    });
    await user.save();

    res.json({
      msg: "Task submitted!",
      points: user.points,
      screenshotUrl: result.secure_url,
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

    // Email users
    const users = await User.find({}, "email");
    users.forEach(u => {
      sendMail(
        u.email,
        "New Task Available",
        `New task: ${task.title} is now available. Log into your dashboard to complete it and earn points!`
      );
    });

    res.json({ msg: "Task added and users notified!", task });
  } catch (err) {
    console.error("❌ Add task error:", err);
    res.status(500).json({ msg: "Error adding task" });
  }
});

module.exports = router;*/