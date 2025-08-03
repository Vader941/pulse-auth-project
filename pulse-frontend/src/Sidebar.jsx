// src/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getGravatarUrl } from "./utils/getGravatarUrl";

const Sidebar = ({ setSelectedSection }) => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-gray-800 text-white p-4 min-h-screen space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pulse</h2>

          {isAuthenticated && user?.email && (
            <Link to="/preferences" title="Preferences" className="relative w-8 h-8">
              <img
                src={getGravatarUrl(user.email)}
                alt="Avatar"
                onError={(e) => {
                  // Fallback to placeholder text if image fails
                  e.target.onerror = null;
                  const initial =
                    (user.displayName || user.username || user.email || "?")[0].toUpperCase();

                  e.target.style.display = "none";

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
        <nav className="space-y-2">
          <Link
            to="/home"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/home") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Home
          </Link>          <Link
            to="/weather"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/weather") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Weather
          </Link>
          <Link
            to="/news"
            className={`block px-2 py-1 rounded hover:bg-gray-700 ${
              isActive("/news") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            News
          </Link>
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

      <div className="border-t border-gray-600 pt-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/preferences"
                className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                  isActive("/preferences") ? "bg-gray-700 font-semibold" : ""
                }`}
              >
                Preferences
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (

          <div className="space-y-2">
            <Link
              to="/login"
              className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                isActive("/login") ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              Login
            </Link>
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

export default Sidebar;
