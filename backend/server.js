//backend server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//const cashoutRoutes = require("./routes/cashout.routes");

//Example test route
app.get("/", (req, res) => {
  res.send("API is working");
});

//connect to MongoDB
console.log("MONGO_URI =>", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
////////////////
app.use((req, res, next) => {
  console.log(`${req.method}
    ${req.url}`);
    next();
});
//////////
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users" , userRoutes)

app.use("/api/tasks", require("./routes/task.routes"));

const participantRoutes = require("./routes/participant.routes")
app.use("/api/participant", participantRoutes);

const cashoutRoutes = require("./routes/cashout.routes");
app.use("/api/cashout", cashoutRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

const proofRoutes = require("./routes/proof.routes");
app.use("/api/proofs", proofRoutes)

const sendMail = require("./utils/sendMail");