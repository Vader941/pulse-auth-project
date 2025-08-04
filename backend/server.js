// BACKEND SERVER SETUP
// This is the main server file that starts our Node.js/Express backend
// It handles API requests from the frontend and connects to MongoDB database

// Import required packages/modules
const express = require("express"); // Web framework for Node.js
const mongoose = require("mongoose"); // MongoDB database connection library
const cors = require("cors"); // Allows frontend to make requests to backend (Cross-Origin Resource Sharing)
const dotenv = require("dotenv"); // Loads environment variables from .env file

// IMPORTANT: Load environment variables FIRST before using any process.env
dotenv.config(); // This reads the .env file and makes variables available via process.env

// Debug logging to make sure server is starting and can read environment variables
console.log("server.js is running...");
console.log("MONGO_URI is:", process.env.MONGO_URI); // ✅ Safe to access after dotenv.config()

// CREATE EXPRESS APPLICATION
const app = express(); // This creates our web server instance
const PORT = process.env.PORT || 5000; // Use environment variable or default to port 5000

// MIDDLEWARE SETUP
// Middleware functions run before our route handlers and can modify requests/responses

app.use(cors()); // Enable CORS - allows frontend (different port) to make requests
app.use(express.json()); // Parse JSON request bodies - converts JSON strings to JavaScript objects

// ROUTE SETUP
// Routes define what happens when someone makes requests to different URLs
// Each route file handles a specific area of functionality

// Import route handlers from separate files (better organization)
const authRoutes = require("./routes/auth"); // User authentication (login/register)

// REGISTER ROUTES WITH EXPRESS APP
// When someone visits /api/auth/*, it will be handled by authRoutes
app.use("/api/auth", authRoutes); // Authentication endpoints (login, register, etc.)

// User-related routes (profiles, preferences, etc.)
app.use("/api/user", require("./routes/user")); 

// Movie-related routes (fetch movies, favorites, etc.)
app.use("/api/movies", require("./routes/movies"));

// DATABASE CONNECTION AND SERVER STARTUP
// Connect to MongoDB database, then start the web server
mongoose
  .connect(process.env.MONGO_URI, {
    // These options help with MongoDB connection reliability
    useNewUrlParser: true, // Use new URL parser (handles connection strings better)
    useUnifiedTopology: true, // Use new connection management engine
  })
  .then(() => {
    // SUCCESS - Database connected successfully
    console.log("MongoDB connected");
    
    // Now start the web server to listen for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // ERROR - Database connection failed
    console.error("MongoDB connection error:", err);
  });

/*
EXPLANATION OF SERVER FLOW:

1. Load environment variables (.env file)
2. Create Express app instance
3. Add middleware (CORS, JSON parsing)
4. Register API routes (/api/auth, /api/user, /api/movies)
5. Connect to MongoDB database
6. Start server listening on specified port

When a request comes in:
1. CORS middleware allows cross-origin requests
2. express.json() parses JSON request bodies
3. Request is routed to appropriate handler based on URL
4. Handler processes request and sends response back
*/
