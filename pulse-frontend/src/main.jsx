// APPLICATION ENTRY POINT
// This is the first file that runs when our React app starts
// It sets up the entire application and renders it to the HTML page

// Import React library and ReactDOM for rendering
import React from "react";
import ReactDOM from "react-dom/client"; // Modern React 18 rendering API

// Import our main App component and global styles
import App from "./App"; // Main application component
import "./index.css"; // Global CSS styles (includes Tailwind CSS)

// Import React Router for navigation between pages
import { BrowserRouter } from "react-router-dom";

// Import our custom authentication context provider
import { AuthProvider } from "./context/AuthContext";

// RENDER THE APPLICATION
// ReactDOM.createRoot creates a "root" element where our React app will live
ReactDOM.createRoot(document.getElementById("root")).render(
  // STRICT MODE - React development tool that helps catch common mistakes
  <React.StrictMode>
    
    {/* ROUTER SETUP - Enables navigation between different pages/URLs */}
    {/* basename="/Pulse" means our app URLs start with /Pulse/ */}
    <BrowserRouter basename="/Pulse">
      
      {/* AUTHENTICATION PROVIDER - Makes login state available throughout the app */}
      {/* This wraps the entire app so ANY component can access user authentication data */}
      <AuthProvider>
        
        {/* MAIN APP COMPONENT - Our entire application */}
        <App />
        
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*
EXPLANATION OF THE WRAPPER STRUCTURE:

1. React.StrictMode - Development helper (removed in production builds)
2. BrowserRouter - Enables URL-based navigation (like /home, /movies, etc.)
3. AuthProvider - Provides user login state to all components
4. App - Our main application component

This structure means:
- Any component in our app can use navigation (useNavigate, Link, etc.)
- Any component can check if user is logged in (useAuth hook)
- The app can handle different URLs and show appropriate pages
*/
