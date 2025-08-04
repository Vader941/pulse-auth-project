// Import React library and necessary hooks
// React: Main library for building user interfaces
// useEffect: Hook that runs code when component loads or when data changes
// useState: Hook that stores data that can change over time
import React, { useEffect, useState } from "react";

// This is our Movies component - shows popular movies from TMDB (The Movie Database)
const Movies = () => {
  // STATE VARIABLES - These store data that changes over time
  
  // This stores the list of movies we get from the API
  const [movies, setMovies] = useState([]); // Starts as empty array
  
  // This tracks whether we're loading, done loading, or got an error
  const [status, setStatus] = useState("loading"); // Starts as "loading"

  // useEffect - This runs when the component first loads
  // The empty array [] at the end means "only run once when component mounts"
  useEffect(() => {
    // ASYNC FUNCTION - This function can wait for network requests
    const fetchMovies = async () => {
      // TRY-CATCH - Handle potential errors gracefully
      try {
        // FETCH - Make a request to get popular movies from our proxy API
        // We use a proxy (Cloudflare Worker) to avoid CORS issues
        const res = await fetch(
          "https://pulse-tmdb-proxy.nable.workers.dev/movie/popular?language=en-US&page=1"
        );
        
        // Check if the request was successful
        if (!res.ok) throw new Error("Failed to fetch");
        
        // Convert the response to JSON (JavaScript Object Notation)
        const data = await res.json();
        
        // Update our movies state with the results
        setMovies(data.results);
        
        // Update status to show we're done loading
        setStatus("done");
      } catch (err) {
        // If something went wrong, log it and set error status
        console.error(err);
        setStatus("error");
      }
    };

    // Actually call the function to fetch movies
    fetchMovies();
  }, []); // Empty dependency array means this only runs once when component loads

  // CONDITIONAL RENDERING - Show different content based on current status
  
  // If still loading, show loading message
  if (status === "loading") return <div className="p-6">Loading movies...</div>;
  
  // If there was an error, show error message
  if (status === "error") return <div className="p-6 text-red-500">Failed to load movies.</div>;

  // If everything is successful, show the movies
  return (
    <div className="p-6"> {/* Main container with padding */}
      
      {/* Page title */}
      <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>
      
      {/* RESPONSIVE GRID - Automatically adjusts columns based on screen size */}
      {/* sm: = small screens (2 columns), md: = medium (3 columns), lg: = large (4 columns) */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
        {/* MAP FUNCTION - Create one movie card for each movie in our array */}
        {movies.map((movie) => (
          // MOVIE CARD - Individual container for each movie
          <div key={movie.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
            
            {/* MOVIE POSTER IMAGE */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // TMDB image URL
              alt={movie.title} // Alt text for screen readers and accessibility
              className="w-full h-auto rounded-t" // Full width, auto height, rounded top corners
            />
            
            {/* MOVIE INFORMATION SECTION */}
            <div className="p-4"> {/* Padding inside the card */}
              
              {/* Movie title */}
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              
              {/* Movie description/overview */}
              {/* line-clamp-3 limits the text to 3 lines with "..." if longer */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{movie.overview}</p>
              
              {/* Movie rating and release date */}
              {/* Using emoji icons for visual appeal */}
              <p className="text-sm mt-2 text-gray-500">⭐ {movie.vote_average} | 📅 {movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// EXPORT - Makes this component available to other files
export default Movies;
