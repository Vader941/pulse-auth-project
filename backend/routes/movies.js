// MOVIE API ROUTES
// This file handles all HTTP requests related to movies
// It defines what happens when the frontend makes requests to /api/movies/*

// Import required modules
const express = require("express"); // Web framework for creating routes
const router = express.Router(); // Create a router instance to define routes
const Movie = require("../models/Movie"); // Import our Movie data model

// ROUTE: GET /api/movies
// PURPOSE: Fetch all movies from the database
// USAGE: Frontend calls this to display movie lists
router.get("/", async (req, res) => {
  // TRY-CATCH: Handle potential database errors gracefully
  try {
    // QUERY DATABASE: Get all movie documents from MongoDB
    const movies = await Movie.find(); // find() with no parameters = get all movies
    
    // SUCCESS: Send movies back to frontend as JSON
    res.json(movies);
  } catch (err) {
    // ERROR: Something went wrong with database query
    // Send error response back to frontend
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// EXPORT ROUTER
// This makes our routes available to the main server.js file
// The main server will use these routes for any requests to /api/movies
module.exports = router;

/*
EXPLANATION OF EXPRESS ROUTING:

1. router.get() - Handles GET requests (fetching data)
2. "/" - The path relative to /api/movies (so this handles /api/movies/)
3. async (req, res) - Function that handles the request
   - req = request object (contains data from frontend)
   - res = response object (used to send data back)
4. Movie.find() - Mongoose method to query database
5. res.json() - Send JSON response back to frontend

FUTURE ENHANCEMENTS:
- Add pagination (limit results per page)
- Add filtering by genre, year, etc.
- Add sorting options (by title, year, rating)
- Add individual movie details route (GET /api/movies/:id)
- Add routes for adding/updating/deleting movies (POST, PUT, DELETE)
*/
