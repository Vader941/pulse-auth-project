// USER DATA MODEL
// This file defines how user account information is stored in MongoDB
// It describes the structure of user documents in our database

// Import mongoose library for database operations
const mongoose = require("mongoose");

// DEFINE USER SCHEMA
// Schema describes what fields each user document should have and their rules
const UserSchema = new mongoose.Schema({
  // EMAIL FIELD - User's email address (used for login)
  email: { 
    type: String,        // Data type: text string
    required: true,      // This field is mandatory
    unique: true         // No two users can have the same email (prevents duplicates)
  },
  
  // PASSWORD FIELD - User's encrypted password
  password: { 
    type: String,        // Data type: text string  
    required: true       // This field is mandatory
  },
  
  // DISPLAY NAME FIELD - Optional name for user profile
  displayName: { 
    type: String,        // Data type: text string
    default: ""          // If not provided, defaults to empty string
  }
});

// CREATE AND EXPORT MODEL
// This creates a "User" collection in MongoDB and makes it available to other files
module.exports = mongoose.model("User", UserSchema);

/*
SECURITY NOTE: 
The password stored here should be HASHED (encrypted) before saving to database.
Never store plain text passwords! The auth routes should use bcrypt or similar
to hash passwords before saving and compare hashed passwords during login.

Example of how this model gets used:
const User = require('./models/User');
const newUser = new User({ 
  email: "john@example.com", 
  password: "hashedPassword123" 
});
await newUser.save();
*/



