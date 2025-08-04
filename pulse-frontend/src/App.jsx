// MAIN APP COMPONENT
// This is the root component that sets up routing and layout for our entire application

// Import React library for building user interfaces
import React from "react";

// Import React Router components for navigation between pages
// Routes: Container for all our route definitions
// Route: Defines what component to show for each URL path
import { Routes, Route } from "react-router-dom";

// Import all our custom components
import Sidebar from "./Sidebar"; // Left navigation menu
import MainPanel from "./MainPanel"; // Main content area (legacy - might be replaced)

// Authentication components
import Signup from "./components/Auth/Signup"; // User registration form
import Login from "./components/Auth/Login"; // User login form
import RequireAuth from "./components/Auth/RequireAuth"; // Wrapper to protect authenticated routes

// Page components - each represents a different section of our app
import Home from "./pages/Home"; // Dashboard/landing page
import Weather from "./pages/Weather"; // Weather information
import News from "./pages/News"; // News headlines
import Movies from "./pages/Movies"; // Popular movies display
import Preferences from "./pages/Preferences"; // User settings
import Search from "./pages/Search"; // Movie search functionality
import Favorites from "./pages/Favorites";

// MAIN APP FUNCTION COMPONENT
function App() {
  // STATE - Currently selected section (used by legacy MainPanel component)
  const [selectedSection, setSelectedSection] = React.useState("Welcome");

  // RETURN JSX - The visual structure of our entire application
  return (
    // MAIN LAYOUT CONTAINER
    // CSS Grid with 2 columns: 200px fixed sidebar + flexible main content
    // Dark mode support with conditional classes
    <div className="min-h-screen grid grid-cols-[200px_1fr] bg-white text-black dark:bg-gray-900 dark:text-white">

      {/* LEFT SIDEBAR - Always visible navigation menu */}
      <Sidebar setSelectedSection={setSelectedSection} />

      {/* RIGHT CONTENT AREA - Changes based on current route/URL */}
      <Routes>
        {/* ROOT ROUTE - Shows MainPanel when visiting just "/" */}
        <Route path="/" element={<MainPanel selectedSection={selectedSection} />} />
        
        {/* AUTHENTICATION ROUTES - Public pages for login/signup */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* MAIN APP PAGES - Available to all users */}
        <Route path="/home" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/news" element={<News />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* PROTECTED ROUTE - Only accessible to logged-in users */}
        {/* RequireAuth wrapper checks if user is authenticated before showing Search */}
        <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />

      </Routes>
    </div>
  );
}

// EXPORT - Makes App component available to other files (like main.jsx)
export default App;
