// AUTHENTICATION API ROUTES
// This file handles all HTTP requests related to user authentication
// It provides endpoints for user registration and login

// Import required modules
const express = require("express"); // Web framework for creating routes
const router = express.Router(); // Create router instance for defining routes
const bcrypt = require("bcrypt"); // Library for hashing passwords securely
const jwt = require("jsonwebtoken"); // Library for creating authentication tokens
const User = require("../models/User"); // Import our User database model

// ROUTE: POST /api/auth/register
// PURPOSE: Create new user accounts
// USAGE: Frontend calls this when user submits signup form
router.post("/register", async (req, res) => {
  // TRY-CATCH: Handle potential errors gracefully
  try {
    // EXTRACT DATA: Get email and password from request body
    const { email, password } = req.body;
    console.log("Received registration:", email); // Debug logging

    // CHECK FOR EXISTING USER: Prevent duplicate email addresses
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already registered" });
    }

    // PASSWORD HASHING: Never store plain text passwords!
    // bcrypt.hash() creates a secure, encrypted version of the password
    // The number 10 is the "salt rounds" - higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // CREATE NEW USER: Save user to database with encrypted password
    const newUser = new User({ 
      email, 
      password: hashedPassword // Store the hashed version, not the original
    });
    await newUser.save(); // Save to MongoDB

    console.log("User created successfully");
    // SUCCESS RESPONSE: Tell frontend that account was created
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // ERROR HANDLING: Something went wrong during registration
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ROUTE: POST /api/auth/login
// PURPOSE: Authenticate existing users
// USAGE: Frontend calls this when user submits login form
router.post("/login", async (req, res) => {
  // TRY-CATCH: Handle potential errors gracefully
  try {
    // EXTRACT CREDENTIALS: Get email and password from request
    const { email, password } = req.body;
    
    // FIND USER: Look for user with this email in database
    const user = await User.findOne({ email });
    if (!user) {
      // User doesn't exist - send generic error message for security
      // (Don't reveal whether email exists or not)
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // VERIFY PASSWORD: Compare provided password with stored hash
    // bcrypt.compare() safely checks if plain text password matches the hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password doesn't match - send same generic error message
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CREATE JWT TOKEN: Generate authentication token for successful login
    // JWT (JSON Web Token) allows user to stay logged in across requests
    const token = jwt.sign(
      { id: user._id }, // Payload: user's database ID
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // SUCCESS RESPONSE: Send token and user info back to frontend
    res.json({
      token, // Authentication token for future requests
      user: {
        id: user._id,
        email: user.email,
        username: user.username || "User" // Fallback if username not stored
      }
    });

  } catch (err) {
    // ERROR HANDLING: Something went wrong during login
    res.status(500).json({ error: "Login failed" });
  }
});

// EXPORT ROUTER: Make routes available to main server.js file
module.exports = router;

/*
SECURITY BEST PRACTICES IMPLEMENTED:

1. PASSWORD HASHING: Never store plain text passwords
2. GENERIC ERROR MESSAGES: Don't reveal if email exists during login
3. JWT TOKENS: Secure, stateless authentication
4. ENVIRONMENT VARIABLES: Keep secrets out of source code
5. SALT ROUNDS: Make password hashing computationally expensive

AUTHENTICATION FLOW:
1. User submits email/password
2. Server finds user by email
3. Server compares password hash
4. Server creates JWT token if valid
5. Frontend stores token for future requests
6. Token sent with subsequent API calls to prove identity
*/
