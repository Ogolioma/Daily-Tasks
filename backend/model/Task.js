const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  points: { type: Number, required: true },
  actionLink: { type: String, required: true },
  questions: [
    {
      question: String,
      answer: String
    }
  ],
  priority: {type:Number, default:0},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);