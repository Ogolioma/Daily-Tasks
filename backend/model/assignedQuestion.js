const mongoose = require("mongoose");

const assignedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  questions: [
    {
      question: String,
      answer: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AssignedQuestion", assignedSchema);
