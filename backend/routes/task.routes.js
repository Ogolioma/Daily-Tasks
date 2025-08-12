const express = require("express");
const router = express.Router();
const Task = require("../model/Task");
const User = require("../model/user");
const Proof = require("../model/proof");
const AssignedQuestion = require("../model/assignedQuestion");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const sendMail = require("../utils/sendMail");

// ------------------ GET ALL TASKS ------------------
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({priority:-1, createdAt:-1});
    res.json(tasks);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err);
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
});

// ------------------ ASSIGN QUESTIONS ------------------
router.post("/assign-questions/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task || !task.questions || task.questions.length === 0) {
      return res.status(404).json({ msg: "No questions to assign." });
    }

    const shuffled = task.questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(2, task.questions.length));

    const assigned = await AssignedQuestion.findOneAndUpdate(
      { userId: req.user.id, taskId },
      { questions: selected },
      { upsert: true, new: true }
    );

    res.json({ questions: assigned.questions });
  } catch (err) {
    console.error("❌ Assign error:", err);
    res.status(500).json({ msg: "Failed to assign questions" });
  }
});

// ------------------ SUBMIT TASK ------------------
router.post("/submit", auth, upload.single("screenshot"), async (req, res) => {
  try {
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

    // ✅ Validate answers properly
    let parsedAnswers = [];
    try {
      parsedAnswers = JSON.parse(answers || "[]");
    } catch (e) {
      return res.status(400).json({ msg: "Invalid answers format." });
    }

    const assigned = await AssignedQuestion.findOne({ userId: req.user.id, taskId });
    const checkAgainst = assigned ? assigned.questions : task.questions;

    if (checkAgainst && checkAgainst.length > 0) {
      for (let i = 0; i < checkAgainst.length; i++) {
        const expected = String(checkAgainst[i]?.answer || "").trim().toLowerCase();
        const answerObj = parsedAnswers.find((ans) => ans.questionId === checkAgainst[i]._id.toString());
        const provided = String(answerObj?.answer || "").trim().toLowerCase();

        console.log(`✅ Comparing Q${i + 1}: expected "${expected}" vs provided "${provided}"`);

        if (expected && expected !== provided) {
          return res.status(400).json({ msg: `Answer to question ${i + 1} is incorrect.` });
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

    const proof = new Proof({
      user: user._id,
      email: user.email,
      task: task._id,
      screenshotUrl: req.file.path,
      pointsAwarded: task.points,
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

    const users = await User.find({}, "email firstName");
    for (const user of users) {
      await sendMail(
        user.email,
        "🆕 New Task Available on Daily Tasks!",
        `
          <div style="font-family:sans-serif;">
            <h2>Hello ${user.firstName || ""},</h2>
            <p>A new task <strong>"${title}"</strong> has been added to your dashboard.</p>
            <p>Log in now to complete it and earn ${points} points.</p>
            <a href="https://dailytasks.co/sign-in.html" style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
              Go to Dashboard
            </a>
          </div>
        `
      );
    }

    res.json({ msg: "Task added & notifications sent!", task });
  } catch (err) {
    console.error("❌ Add task error:", err);
    res.status(500).json({ msg: "Error adding task" });
  }
});

// ------------------ CPX POSTBACK HANDLER ------------------
router.get("/cpx-postback", async (req, res) => {
  console.log("Route /cpx-postback hit with query:", req.query); // Confirm route is reached
  try {
    console.log("Postback received with query:", req.query);
    const { status, trans_id, user_id, sub_id, sub_id_2, amount_local, amount_usd, offer_id, hash, ip_click } = req.query;

    console.log("Received user_id:", user_id);
    const user = await User.findById(user_id);
    if (!user) {
      console.log("No user found for user_id:", user_id);
      return res.status(404).send('User not found');
    }

    const parsedStatus = parseInt(status, 10);
    if (parsedStatus === 1) {
      const rewardAmount = parseFloat(amount_usd) || parseFloat(amount_local) || 0; // Use CPX's amount
      const points = Math.round(rewardAmount); // Round to nearest whole number
      console.log("Received reward amount:", rewardAmount, "Assigned points:", points);
      if (points < 1) points = 1; // Minimum 1 point for screen-out or zero amounts
      user.points += points;
      user.notifications.push({
        message: `You ${points > 1 ? 'completed' : 'got screened out of'} a survey and earned ${points} points. (Transaction: ${trans_id})`,
      });
      await user.save();
      console.log("Points updated for user_id:", user_id, "New points:", user.points);
    } else if (parsedStatus === 2) {
      console.log(`Reversal for trans_id ${trans_id} - points deduction not implemented yet.`);
    }

    res.send('OK');
  } catch (err) {
    console.error("❌ CPX postback error:", err.message, err.stack);
    res.status(500).send('Error');
  }
});

module.exports = router;