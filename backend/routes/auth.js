const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received registration:", email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    console.log("User created successfully");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});


// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
  token,
  user: {
    id: user._id,
    email: user.email,
    username: user.username || "User" // fallback if username is not stored
  }
});

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
