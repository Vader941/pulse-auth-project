// MAIN PANEL COMPONENT (LEGACY)
// This component is from an earlier version of the app architecture
// It's still used as a fallback for the root "/" route, but most navigation
// now goes directly to specific page components via React Router

// Import React and the Weather component
import React from "react";
import Weather from "./pages/Weather"; // Weather page component

// MAIN PANEL COMPONENT - Displays different content based on selected section
// NOTE: This is legacy code - newer versions use direct routing to page components
function MainPanel({ selectedSection }) {
  // RETURN JSX - Show different content based on selectedSection prop
  return (
    <main className="p-4"> {/* Main content area with padding */}
      
      {/* DEFAULT WELCOME SECTION - Shown when no specific section is selected */}
      {selectedSection === "Welcome" && (
        <>
          <h1 className="text-2xl font-bold">Welcome to Pulse</h1>
          <p>Select a section on the left.</p>
        </>
      )}
      
      {/* WEATHER SECTION - Show Weather component */}
      {selectedSection === "Weather" && <Weather />}
      
      {/* NEWS SECTION - Placeholder content */}
      {selectedSection === "News" && <h1 className="text-xl">News Section</h1>}
      
      {/* MOVIES SECTION - Placeholder content */}
      {selectedSection === "Movies" && <h1 className="text-xl">Movies Section</h1>}
    </main>
  );
}

// EXPORT - Makes this component available to other files
export default MainPanel;

/*
ARCHITECTURAL NOTE:

This component represents an older approach to single-page applications where
one main component would conditionally render different content based on state.

The app has since evolved to use React Router for navigation:
- Each section now has its own page component (Home.jsx, Weather.jsx, etc.)
- Navigation is handled by React Router based on URL paths
- This MainPanel is mainly kept for backward compatibility

MODERN EQUIVALENT:
Instead of: <MainPanel selectedSection="Weather" />
We now use: React Router navigates directly to <Weather /> component

This is a good example of how applications evolve over time while maintaining
backward compatibility during transitions.
*/
