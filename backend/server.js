const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // ✅ This must come BEFORE accessing any process.env

console.log("server.js is running...");
console.log("MONGO_URI is:", process.env.MONGO_URI); // ✅ Now safe to log

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); //
app.use("/api/user", require("./routes/user")); // 

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
