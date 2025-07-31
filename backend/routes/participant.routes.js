const express = require("express");
const router = express.Router();
const ParticipantRequest = require("../model/ParticipantRequest");

// POST /api/participants
router.post("/", async (req, res) => {
  try {
    const {
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
    } = req.body;

    const newRequest = new ParticipantRequest({
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
    });

    await newRequest.save();

    res.status(200).json({ msg: "Request submitted successfully. We'll get back to you shortly." });
  } catch (err) {
    console.error("Error saving participant request:", err);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

module.exports = router;
