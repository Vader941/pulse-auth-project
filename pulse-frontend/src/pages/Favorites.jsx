// Import React and the useState, useEffect hooks
import React, { useState, useEffect } from "react";

// Main Favorites component
const Favorites = () => {
  // STATE: Array of saved favorite movies
  const [favorites, setFavorites] = useState([]);

  // STATE: Selected movie for modal view
  const [selectedMovie, setSelectedMovie] = useState(null);

  // useEffect runs once when component loads
  useEffect(() => {
    // Get current user (simple localStorage-based auth)
    const user = localStorage.getItem("user");
    if (!user) return; // If no user is logged in, do nothing

    // Build the key used for this user's favorites in localStorage
    const key = `favorites-${user}`;

    // Retrieve the list of favorites or use an empty array
    const stored = JSON.parse(localStorage.getItem(key)) || [];

    // Set the state with the retrieved data
    setFavorites(stored);
  }, []);

  // Function to remove a movie from favorites
  const handleRemove = (movieId) => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const key = `favorites-${user}`;
    const updated = favorites.filter((movie) => movie.id !== movieId);

    // Update localStorage and state
    localStorage.setItem(key, JSON.stringify(updated));
    setFavorites(updated);
  };

  // Function to show modal with movie details
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedMovie(null);
  };

  // JSX to display the component
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Favorite Movies</h2>

      {/* If there are favorites, show them in a grid. Otherwise, show message */}
      {favorites.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <li
              key={movie.id}
              className="border p-2 rounded bg-white shadow relative cursor-pointer hover:shadow-lg"
              onClick={() => handleMovieClick(movie)}
            >
              {/* Movie title */}
              <h3 className="font-semibold">{movie.title}</h3>

              {/* Poster image if available */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="mt-2"
                />
              )}

              {/* Release date */}
              <p className="text-sm mt-1">{movie.release_date}</p>

              {/* Remove button - stops click from opening modal */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent modal open
                  handleRemove(movie.id);
                }}
                className="mt-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't saved any movies yet.</p>
      )}

      {/* MODAL POPUP - Shows only when a movie is selected */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full relative shadow-xl">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              ✖
            </button>

            {/* Movie title */}
            <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>

            {/* Larger movie poster */}
            {selectedMovie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="mb-4 mx-auto"
              />
            )}

            {/* Movie overview */}
            <p className="text-gray-700 mb-2">{selectedMovie.overview}</p>

            {/* Release and rating info */}
            <p className="text-sm text-gray-600">
              <strong>Release Date:</strong> {selectedMovie.release_date}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Rating:</strong> {selectedMovie.vote_average} ({selectedMovie.vote_count} votes)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component for use in the app
export default Favorites;
