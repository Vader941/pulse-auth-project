// USER PREFERENCES PAGE
// This component allows users to customize their account settings and app preferences
// Includes display name updates, dark mode toggle, and avatar management

// Import necessary React hooks and utilities
import React, { useState, useEffect } from "react";
import axios from "axios"; // HTTP client for API requests
import { useAuth } from "../context/AuthContext"; // Access user authentication state
import { getGravatarUrl } from "../utils/getGravatarUrl"; // Generate avatar images

// PREFERENCES COMPONENT - User settings and customization page
const Preferences = () => {
  // AUTHENTICATION STATE - Get user data and token for API requests
  const { token, user, login } = useAuth();

  // FORM STATE - Store user input and UI status
  const [displayName, setDisplayName] = useState(""); // User's display name
  const [status, setStatus] = useState(""); // Success/error messages
  const [loading, setLoading] = useState(true); // Loading state while data loads

  // DARK MODE STATE - Initialize from browser storage to persist user preference
  // This checks localStorage to see if user previously enabled dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // DARK MODE EFFECT - Apply dark mode setting when it changes
  // This runs whenever darkMode state changes
  useEffect(() => {
    // PERSIST SETTING - Save preference to browser storage
    localStorage.setItem("darkMode", darkMode);
    
    // APPLY THEME - Add/remove 'dark' class to HTML element
    // Tailwind CSS uses this class to apply dark mode styles throughout the app
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]); // Only run when darkMode changes

  // USER DATA INITIALIZATION - Set up form with existing user data
  useEffect(() => {
    if (user) {
      // Pre-fill form with user's current display name (or empty string if none)
      setDisplayName(user.displayName || "");
      setLoading(false); // Data is loaded, stop showing loading message
    }
  }, [user]); // Run when user data changes

  // FORM SUBMISSION HANDLER - Save user preferences to backend
  const handleSubmit = async (e) => {
    // Prevent form from refreshing the page
    e.preventDefault();
    
    // Clear any previous status messages
    setStatus("");

    // TRY-CATCH - Handle potential API errors
    try {
      // MAKE API REQUEST - Send updated preferences to backend
      const res = await axios.put(
        "http://localhost:5000/api/user/preferences", // API endpoint
        { displayName }, // Data to send
        { headers: { Authorization: `Bearer ${token}` } } // Include auth token
      );

      // UPDATE CONTEXT - Update app-wide user state with new data
      login(token, res.data.user); // This refreshes the user data throughout the app
      
      // SHOW SUCCESS MESSAGE
      setStatus("✅ Preferences saved!");
    } catch (err) {
      // ERROR HANDLING - Something went wrong
      console.error(err);
      setStatus("❌ Failed to save preferences.");
    }
  };

  // LOADING STATE - Show loading message while data is being fetched
  if (loading) {
    return <div className="p-6 text-gray-500">Loading your preferences...</div>;
  }

  // RETURN JSX - The preferences form and settings
  return (
    <div className="p-6"> {/* Main container with padding */}
      
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold mb-4">User Preferences</h2>

      {/* AVATAR SECTION - Show user's Gravatar image and instructions */}
      {user?.email && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Avatar</h3>
          <div className="flex items-center gap-4">
            
            {/* USER AVATAR IMAGE */}
            <img
              src={getGravatarUrl(user.email)}
              alt="Gravatar" // Alt text for accessibility
              className="w-16 h-16 rounded-full border"
            />
            
            {/* AVATAR INSTRUCTIONS */}
            <div>
              <p className="text-sm text-gray-600">
                Your avatar is managed via{" "}
                <a
                  href="https://gravatar.com"
                  target="_blank" // Opens in new tab
                  rel="noopener noreferrer" // Security attributes for external links
                  className="text-blue-500 hover:underline"
                >
                  Gravatar
                </a>
                . To change it, update your image on their website.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DARK MODE TOGGLE SECTION - Local setting stored in browser */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Display Settings</h3>
        
        {/* TOGGLE SWITCH - Custom styled checkbox for dark mode */}
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            
            {/* HIDDEN CHECKBOX - Screen readers can still access this */}
            <input
              type="checkbox"
              checked={darkMode} // Current dark mode state
              onChange={() => setDarkMode(!darkMode)} // Toggle dark mode when clicked
              className="sr-only" // Screen reader only - visually hidden
            />
            
            {/* TOGGLE BACKGROUND - Gray background of the switch */}
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            
            {/* TOGGLE DOT - White circle that slides left/right */}
            <div
              className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                darkMode ? "translate-x-6" : "" // Move right when dark mode is on
              }`}
            ></div>
          </div>
          
          {/* TOGGLE LABEL */}
          <span className="ml-3 text-sm">Dark Mode</span>
        </label>
      </div>

      {/* DISPLAY NAME FORM - Update user's display name */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        
        {/* DISPLAY NAME INPUT FIELD */}
        <label className="block">
          Display Name:
          <input
            type="text"
            className="w-full border p-2 mt-1 rounded"
            value={displayName} // Controlled input
            onChange={(e) => setDisplayName(e.target.value)} // Update state when user types
          />
        </label>
        
        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </form>

      {/* STATUS MESSAGE - Show success or error messages */}
      {status && <p className="mt-4">{status}</p>}

    </div>
  );
};

// EXPORT - Makes this component available to other files
export default Preferences;

/*
PREFERENCES FEATURES EXPLAINED:

1. AVATAR MANAGEMENT:
   - Uses Gravatar service for profile pictures
   - Links users to Gravatar.com to update their image
   - No local image upload needed

2. DARK MODE TOGGLE:
   - Stored in browser localStorage (persists between visits)
   - Applies 'dark' class to HTML element for Tailwind CSS
   - Custom toggle switch UI component

3. DISPLAY NAME:
   - Saved to backend database via API call
   - Updates app-wide user context when changed
   - Form validation and error handling

DARK MODE IMPLEMENTATION:
- State stored in localStorage for persistence
- useEffect applies changes to document.documentElement
- Tailwind CSS 'dark:' prefix classes handle styling
- Toggle switch provides intuitive UI

API INTEGRATION:
- Uses JWT token for authentication
- Sends PUT request to update user preferences
- Updates context with new user data on success
- Provides user feedback via status messages
*/
