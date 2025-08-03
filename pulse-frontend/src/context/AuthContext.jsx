// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// 1️⃣ Create a new context
export const AuthContext = createContext();

// 2️⃣ Provide the context to the rest of your app
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Try to load the token from localStorage when app starts
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  /**
   * 🔐 Called after a successful login.
   * Saves token and user to state and localStorage.
   */
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user as a string

    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * 🚪 Logs out the user and clears everything.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setTimeout(() => {
        navigate("/home"); // Go to Home page
    }, 0);
   
  };

  /**
   * ♻️ Runs once when the app starts to restore login session
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Convert from string to object
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
