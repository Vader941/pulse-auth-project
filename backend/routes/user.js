const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// PUT /api/user/preferences
router.put("/preferences", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { displayName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { displayName },
      { new: true }
    );

    res.json({ message: "Preferences updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating preferences:", err);
    res.status(500).json({ error: "Could not update preferences" });
  }
});

module.exports = router;
