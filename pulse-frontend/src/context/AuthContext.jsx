// AUTHENTICATION CONTEXT
// This file manages user login state across the entire application
// Any component can access user authentication data through this context

// Import React hooks and router functionality
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // For programmatic navigation

// 1️⃣ CREATE AUTHENTICATION CONTEXT
// Context allows components to share data without passing props down through every level
export const AuthContext = createContext();

// 2️⃣ AUTHENTICATION PROVIDER COMPONENT
// This wraps our entire app and provides authentication state to all components
export const AuthProvider = ({ children }) => {
  // Get navigation function for redirecting users
  const navigate = useNavigate();

  // STATE VARIABLES - Store authentication information
  
  // Try to load existing token from browser storage when app starts
  // If there's a saved token, user was previously logged in
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  
  // Store user information (email, name, etc.)
  const [user, setUser] = useState(null);
  
  // Boolean flag - is user currently logged in?
  // !!token converts token to boolean (true if token exists, false if null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  /**
   * LOGIN FUNCTION 🔐
   * Called when user successfully logs in
   * Saves authentication data and updates app state
   */
  const login = (newToken, userData) => {
    // PERSISTENT STORAGE - Save to browser storage so login persists between visits
    localStorage.setItem("token", newToken); // Authentication token
    localStorage.setItem("user", JSON.stringify(userData)); // User info (convert object to string)

    // UPDATE COMPONENT STATE - This will trigger re-renders throughout the app
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * LOGOUT FUNCTION 🚪
   * Clears all authentication data and redirects user
   */
  const logout = () => {
    // CLEAR PERSISTENT STORAGE - Remove saved data from browser
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // CLEAR COMPONENT STATE - Reset everything to logged-out state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // REDIRECT USER - Go back to home page after logout
    // setTimeout ensures state updates finish before navigation
    setTimeout(() => {
        navigate("/home"); // Redirect to Home page
    }, 0);
  };

  /**
   * INITIALIZATION EFFECT ♻️
   * Runs once when the app starts to restore previous login session
   * If user was logged in before, automatically log them back in
   */
  useEffect(() => {
    // Check if there's saved authentication data in browser storage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If we found a saved token, restore the user's login session
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      // If we also have saved user data, restore it too
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Convert from string back to object
      }
    }
  }, []); // Empty dependency array = only run once when component mounts

  // PROVIDE CONTEXT VALUE
  // This makes authentication state and functions available to all child components
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children} {/* Render all child components with access to auth context */}
    </AuthContext.Provider>
  );
};

// 3️⃣ CUSTOM HOOK FOR EASY ACCESS
// Instead of using useContext(AuthContext) everywhere, components can use useAuth()
export const useAuth = () => useContext(AuthContext);

/*
HOW TO USE THIS CONTEXT IN COMPONENTS:

import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.email}!</div>;
  } else {
    return <div>Please log in</div>;
  }
}

CONTEXT BENEFITS:
- No prop drilling (passing data through many component levels)
- Global state management for authentication
- Automatic re-rendering when auth state changes
- Persistent login sessions across browser refreshes
*/
