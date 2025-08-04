// Import React library and the useState hook
// React is the main library for building user interfaces
// useState is a "hook" that lets us store and update data in our component
import React, { useState } from "react";

// This is our main Search component - it's a function that returns JSX (HTML-like code)
const Search = () => {
  // STATE VARIABLES - These store data that can change over time
  // useState returns two things: [currentValue, functionToUpdateValue]
  
  // This stores what the user types in the search box
  const [query, setQuery] = useState(""); // Starts as empty string ""
  
  // This stores the list of movies we get back from our search
  const [results, setResults] = useState([]); // Starts as empty array []
  
  // This stores which movie the user clicked on (for the popup/modal)
  const [selectedMovie, setSelectedMovie] = useState(null); // Starts as null (nothing selected)

  // SEARCH FUNCTION - This runs when the user clicks "Search" or presses Enter
  const handleSearch = async (e) => {
    // e.preventDefault() stops the form from refreshing the page (default form behavior)
    e.preventDefault();
    
    // If the search box is empty, don't do anything
    if (!query) return;

    // TRY-CATCH: This handles errors gracefully
    // If something goes wrong in the "try" block, the "catch" block runs instead
    try {
      // FETCH: This makes a request to get data from the internet
      // We're asking a movie database API for movies matching our search
      const response = await fetch(
        `https://pulse-tmdb-proxy.nable.workers.dev/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`
      );
      
      // Convert the response to JSON format (JavaScript Object Notation)
      const data = await response.json();
      
      // Update our results state with the movies we found
      // data.results is the array of movies, or [] if no results
      setResults(data.results || []);
    } catch (error) {
      // If something went wrong, log the error to the browser console
      console.error("Search failed:", error);
    }
  };

  // CLICK HANDLER - This runs when user clicks on a movie in the search results
  const handleMovieClick = (movie) => {
    // Set the selectedMovie state to the movie they clicked
    // This will show the detailed popup/modal for that movie
    setSelectedMovie(movie);
  };

  // CLOSE MODAL FUNCTION - This runs when user wants to close the movie details popup
  const closeModal = () => {
    // Set selectedMovie back to null, which hides the popup
    setSelectedMovie(null);
  };

  // SAVE FAVORITE FUNCTION - This saves a movie to the user's favorites list
  const handleSaveFavorite = (movie) => {
    // LOCAL STORAGE: Browser's way of storing data that persists between visits
    // Get the current user from localStorage (this should be improved with proper auth)
    const user = localStorage.getItem("user");
    
    // If no user is logged in, show an alert and stop
    if (!user) return alert("Please log in to save favorites.");

    // Create a unique key for this user's favorites list
    const key = `favorites-${user}`;
    
    // Get existing favorites from localStorage, or start with empty array
    // JSON.parse converts the stored string back into a JavaScript array
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    // Check if this movie is already in favorites
    // .some() returns true if any item in the array matches our condition
    if (existing.some((m) => m.id === movie.id)) {
      return alert("Movie already saved.");
    }

    // Add the new movie to the favorites array
    existing.push(movie);
    
    // Save the updated favorites back to localStorage
    // JSON.stringify converts the array to a string for storage
    localStorage.setItem(key, JSON.stringify(existing));
    
    // Let the user know it worked
    alert("Saved to favorites!");
  };

  // RETURN STATEMENT - This is what gets displayed on the page
  // JSX looks like HTML but it's actually JavaScript
  return (
    <div className="p-4"> {/* Main container with padding */}
      
      {/* SEARCH FORM - When submitted, it calls handleSearch function */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        
        {/* TEXT INPUT - Where user types their search query */}
        <input
          type="text"
          placeholder="Search for a movie..." // Gray text shown when input is empty
          value={query} // The input's value is controlled by our query state
          onChange={(e) => setQuery(e.target.value)} // Update query state when user types
          className="p-2 border rounded w-full" // Styling classes
        />
        
        {/* SUBMIT BUTTON - Triggers the search when clicked */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* CONDITIONAL RENDERING - Show different things based on our data */}
      {/* If we have results, show the movie grid. Otherwise, show "no results" message */}
      {results.length > 0 ? (
        // MOVIE RESULTS GRID - Display all found movies in a responsive grid
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* MAP FUNCTION - Create one <li> for each movie in our results array */}
          {results.map((movie) => (
            <li
              key={movie.id} // React needs unique "key" for each list item
              className="border rounded p-2 bg-white cursor-pointer hover:shadow-lg"
              onClick={() => handleMovieClick(movie)} // When clicked, show movie details
            >
              {/* Movie title */}
              <h3 className="text-lg font-bold">{movie.title}</h3>
              
              {/* Movie poster image - only show if poster exists */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title} // Alt text for accessibility/screen readers
                  className="mt-2"
                />
              )}
              
              {/* Release date */}
              <p className="text-sm mt-1">{movie.release_date}</p>
            </li>
          ))}
        </ul>
      ) : (
        // Show this message only if user searched but found no results
        query && <p>No results found.</p>
      )}

      {/* MODAL/POPUP - Only shows when selectedMovie is not null */}
      {/* This is a detailed view that appears over the main content */}
      {selectedMovie && (
        // MODAL BACKDROP - Dark overlay that covers the entire screen
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
          {/* MODAL CONTENT - The white box with movie details */}
          <div className="bg-white p-6 rounded max-w-md w-full relative shadow-xl">
            
            {/* CLOSE BUTTON - X button in top-right corner */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={closeModal} // Closes the modal when clicked
            >
              ✖
            </button>
            
            {/* MOVIE DETAILS */}
            <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
            
            {/* Large movie poster - only show if it exists */}
            {selectedMovie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="mb-4 mx-auto" // mx-auto centers the image
              />
            )}
            
            {/* Movie description/plot summary */}
            <p className="text-gray-700 mb-2">{selectedMovie.overview}</p>
            
            {/* Additional movie information */}
            <p className="text-sm text-gray-600">
              <strong>Release Date:</strong> {selectedMovie.release_date}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Rating:</strong> {selectedMovie.vote_average} ({selectedMovie.vote_count} votes)
            </p>
            <p className="text-sm text-gray-600">
              <strong>Genres:</strong> {selectedMovie.genre_ids?.join(", ")} {/* Placeholder - genre IDs need to be converted to names */}
            </p>
            
            {/* SAVE TO FAVORITES BUTTON */}
            <button
              onClick={() => handleSaveFavorite(selectedMovie)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save to Favorites
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// EXPORT - This makes our Search component available to other files
// Other components can import this with: import Search from './Search'
export default Search;
