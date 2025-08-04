// Import necessary React components and hooks
// React: Main library for building user interfaces
// Link: Component from React Router for navigation between pages
// useLocation: Hook that tells us which page we're currently on
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Import our custom authentication context and utility function
import { useAuth } from "./context/AuthContext"; // Custom hook for user authentication state
import { getGravatarUrl } from "./utils/getGravatarUrl"; // Function to get user avatar images

// SIDEBAR COMPONENT - The navigation menu on the left side of the app
const Sidebar = ({ setSelectedSection }) => {
  // HOOKS - These give us access to current page location and user authentication
  const location = useLocation(); // Tells us what page we're currently viewing
  const { isAuthenticated, logout, user } = useAuth(); // Get authentication state and functions

  // HELPER FUNCTION - Checks if a navigation link should be highlighted as "active"
  const isActive = (path) => location.pathname === path;

  // RETURN JSX - The visual structure of our sidebar
  return (
    // MAIN SIDEBAR CONTAINER - Dark background, white text, full height, spaced content
    <aside className="bg-gray-800 text-white p-4 min-h-screen space-y-6">
      
      {/* TOP SECTION - Logo and user avatar */}
      <div>
        {/* HEADER - App name and user avatar */}
        <div className="flex items-center justify-between mb-4">
          {/* App logo/name */}
          <h2 className="text-xl font-bold">Pulse</h2>

          {/* USER AVATAR - Only show if user is logged in and has email */}
          {isAuthenticated && user?.email && (
            <Link to="/preferences" title="Preferences" className="relative w-8 h-8">
              <img
                src={getGravatarUrl(user.email)} // Get avatar image from Gravatar service
                alt="Avatar"
                onError={(e) => {
                  // FALLBACK HANDLING - If avatar image fails to load, show user's initial instead
                  e.target.onerror = null; // Prevent infinite error loops
                  
                  // Get first letter of user's name or email
                  const initial =
                    (user.displayName || user.username || user.email || "?")[0].toUpperCase();

                  // Hide the broken image
                  e.target.style.display = "none";

                  // Create a fallback div with the user's initial
                  const fallback = document.createElement("div");
                  fallback.className =
                    "absolute top-0 left-0 w-8 h-8 bg-gray-500 text-white flex items-center justify-center rounded-full text-sm font-bold";
                  fallback.innerText = initial;
                  e.target.parentNode.appendChild(fallback);
                }}
                className="w-8 h-8 rounded-full border hover:scale-105 transition"
              />
            </Link>
          )}
        </div>
        {/* MAIN NAVIGATION - Links to different pages of the app */}
        <nav className="space-y-2">
          
          {/* HOME LINK */}
          <Link
            to="/home" // Navigate to /home page when clicked
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/home") ? "bg-gray-700 font-semibold" : "" // Highlight if currently on this page
            }`}
          >
            Home
          </Link>
          
          {/* WEATHER LINK */}
          <Link
            to="/weather"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/weather") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Weather
          </Link>
          
          {/* NEWS LINK */}
          <Link
            to="/news"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/news") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            News
          </Link>
          
          {/* MOVIES LINK */}
          <Link
            to="/movies"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/movies") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Movies
          </Link>
        </nav>
      </div>

      {/* BOTTOM SECTION - User-specific actions (login/logout/preferences) */}
      {/* border-t creates a line separating this section from navigation above */}
      <div className="border-t border-gray-600 pt-4">
        
        {/* CONDITIONAL RENDERING - Show different content based on whether user is logged in */}
        {isAuthenticated ? (
          // IF USER IS LOGGED IN - Show authenticated user options
          <>
            {/* SEARCH MOVIES LINK - Only available to logged-in users */}
            <Link
              to="/search"
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                isActive("/search") ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              🔍 Search Movies {/* Emoji icon for visual appeal */}
            </Link>
              <Link
                to="/favorites"
                className="hover:underline text-white px-2"
              >
                Favorites
              </Link>
            {/* PREFERENCES LINK - User settings and preferences */}
            <Link
              to="/preferences"
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                isActive("/preferences") ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              Preferences
            </Link>
            
            {/* LOGOUT BUTTON - Ends user session */}
            <button
              onClick={logout} // Call logout function from AuthContext
              className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
            >
              Logout
            </button>
          </>
        ) : (
          // IF USER IS NOT LOGGED IN - Show login and signup options
          <div className="space-y-2">
            
            {/* LOGIN LINK */}
            <Link
              to="/login"
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                isActive("/login") ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              Login
            </Link>
            
            {/* SIGNUP LINK */}
            <Link
              to="/signup"
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                isActive("/signup") ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

// EXPORT - Makes this component available to other files
export default Sidebar;
