// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Secure CORS for production
app.use(cors({
  origin: ["https://dailytasks.co",
    "http://127.0.0.1:5500"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Connect to MongoDB
console.log("MONGO_URI =>", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/toluna", require("./routes/toluna.routes"));
app.use("/api/participant", require("./routes/participant.routes"));
app.use("/api/cashout", require("./routes/cashout.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/proofs", require("./routes/proof.routes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
