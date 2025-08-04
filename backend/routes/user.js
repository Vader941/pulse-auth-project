// USER MANAGEMENT API ROUTES  
// This file handles HTTP requests related to user account management
// It provides endpoints for updating user preferences and profile information

// Import required modules
const express = require("express"); // Web framework for creating routes
const router = express.Router(); // Create router instance for defining routes
const User = require("../models/User"); // Import User database model
const jwt = require("jsonwebtoken"); // Library for verifying authentication tokens

// ROUTE: PUT /api/user/preferences
// PURPOSE: Update user profile preferences (like display name)
// USAGE: Frontend calls this when user updates their profile settings
router.put("/preferences", async (req, res) => {
  // TRY-CATCH: Handle potential errors gracefully
  try {
    // TOKEN VERIFICATION: Check if user is authenticated
    // Extract token from Authorization header: "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      // No token provided - user is not authenticated
      return res.status(401).json({ message: "Unauthorized" });
    }

    // DECODE JWT TOKEN: Verify token and extract user information
    // This will throw an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Get user's database ID from token

    // EXTRACT UPDATE DATA: Get new preferences from request body
    const { displayName } = req.body;

    // UPDATE USER IN DATABASE: Find user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Find user with this ID
      { displayName }, // Update these fields
      { new: true } // Return the updated document (not the old one)
    );

    // SUCCESS RESPONSE: Send confirmation and updated user data
    res.json({ 
      message: "Preferences updated", 
      user: updatedUser 
    });
  } catch (err) {
    // ERROR HANDLING: Something went wrong during update
    console.error("Error updating preferences:", err);
    res.status(500).json({ error: "Could not update preferences" });
  }
});

// EXPORT ROUTER: Make routes available to main server.js file
module.exports = router;

/*
AUTHENTICATION MIDDLEWARE EXPLANATION:

This route uses JWT token verification to ensure only authenticated users
can update their preferences. Here's the flow:

1. Frontend sends request with Authorization header: "Bearer <jwt-token>"
2. Server extracts token from header
3. Server verifies token using JWT_SECRET
4. If valid, server extracts user ID from token
5. Server updates user's data in database
6. Server sends success response

SECURITY CONSIDERATIONS:

1. TOKEN VERIFICATION: Only authenticated users can access this endpoint
2. USER ISOLATION: Users can only update their own data (ID from token)
3. ERROR HANDLING: Generic error messages don't expose system details
4. AUTHORIZATION HEADER: Standard way to send authentication tokens

FUTURE ENHANCEMENTS:
- Add input validation for displayName
- Add more user preferences (theme, notifications, etc.)
- Add profile picture upload functionality
- Add password change endpoint
- Add account deletion endpoint
*/
