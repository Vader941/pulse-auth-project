// MOVIE DATA MODEL
// This file defines the structure of how movie data is stored in our MongoDB database
// It uses Mongoose, which is a library that makes working with MongoDB easier

// Import mongoose library for database operations
const mongoose = require("mongoose");

// DEFINE MOVIE SCHEMA
// A schema is like a blueprint that describes what fields a movie document should have
const movieSchema = new mongoose.Schema({
  // REQUIRED FIELDS - These must be provided when creating a movie
  title: { 
    type: String,        // Data type: text string
    required: true       // This field is mandatory
  },
  year: { 
    type: Number,        // Data type: number
    required: true       // This field is mandatory
  },
  
  // OPTIONAL FIELDS - These can be empty/null
  genre: { 
    type: String         // Movie category (Action, Comedy, Drama, etc.)
  },
  poster: { 
    type: String         // URL link to movie poster image
  },
  description: { 
    type: String         // Plot summary or movie description
  },
}, { 
  // SCHEMA OPTIONS
  timestamps: true       // Automatically add 'createdAt' and 'updatedAt' fields
});

// CREATE AND EXPORT MODEL
// This creates a "Movie" collection in MongoDB based on our schema
// Other files can import this to create, read, update, or delete movies
module.exports = mongoose.model("Movie", movieSchema);

/*
EXPLANATION OF MONGOOSE CONCEPTS:

1. SCHEMA - Defines the structure and rules for documents
2. MODEL - A constructor function created from a schema
3. DOCUMENT - Individual records in the database (like rows in SQL)
4. COLLECTION - Groups of documents (like tables in SQL)

Example usage in other files:
const Movie = require('./models/Movie');
const newMovie = new Movie({ title: "Inception", year: 2010 });
await newMovie.save();
*/
