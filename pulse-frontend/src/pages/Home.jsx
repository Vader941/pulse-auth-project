// HOME PAGE COMPONENT
// This is the main dashboard/landing page of our Pulse application
// It shows different content based on whether the user is logged in or not

// Import necessary React components and utilities
import React from "react";
import { useAuth } from "../context/AuthContext"; // Access user authentication state
import { Link } from "react-router-dom"; // For navigation links
import { getGravatarUrl } from "../utils/getGravatarUrl"; // Generate user avatar images

// HOME COMPONENT - Main dashboard page
const Home = () => {
  // GET AUTHENTICATION STATE - Check if user is logged in and get user data
  const { isAuthenticated, user } = useAuth();
  
  // GENERATE AVATAR URL - Create Gravatar image URL if user has email
  const avatarUrl = user?.email ? getGravatarUrl(user.email) : null;

  // RETURN JSX - The visual content of the home page
  return (
    <div className="p-8"> {/* Main container with padding */}
      
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Pulse</h1>

      {/* CONDITIONAL USER GREETING - Show different content based on login status */}
      {isAuthenticated && user ? (
        // USER IS LOGGED IN - Show personalized greeting with avatar
        <>
          <div className="flex items-center gap-4 mb-4">
            
            {/* USER AVATAR - Show Gravatar image if available */}
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Gravatar" // Alt text for accessibility
                className="w-16 h-16 rounded-full border"
              />
            )}
            
            {/* PERSONALIZED GREETING */}
            <div className="text-green-700 text-lg">
              ✅ Logged in as <strong>
                {/* Show display name, username, or email - whichever is available */}
                {user.displayName || user.username || user.email}
              </strong>
            </div>
          </div>
        </>
      ) : (
        // USER IS NOT LOGGED IN - Show login prompt
        <div className="mb-6 text-red-500 text-lg">❌ You are not logged in.</div>
      )}

      {/* APP DESCRIPTION */}
      <p className="text-gray-700 mb-8 max-w-xl">
        Pulse is your personalized dashboard for essential daily info — weather, news, and entertainment — all in one place.
        Sign in to save your preferences and make it yours.
      </p>

      {/* NAVIGATION BUTTONS - Quick access to main app features */}
      {/* Responsive grid that adjusts based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* WEATHER BUTTON */}
        <Link
          to="/weather" // Navigate to weather page when clicked
          className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          🌤️ Check Weather
        </Link>
        
        {/* NEWS BUTTON */}
        <Link
          to="/news" // Navigate to news page when clicked
          className="block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          📰 View News
        </Link>
        
        {/* MOVIES BUTTON */}
        <Link
          to="/movies" // Navigate to movies page when clicked
          className="block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          🎬 Explore Movies
        </Link>
      </div>
    </div>
  );
};

// EXPORT - Makes this component available to other files
export default Home;
