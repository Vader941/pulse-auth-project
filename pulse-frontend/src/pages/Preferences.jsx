import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getGravatarUrl } from "../utils/getGravatarUrl";

const Preferences = () => {
  const { token, user, login } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // 1️⃣ NEW: Dark mode state initialized from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 2️⃣ NEW: Apply dark mode setting to the root HTML element
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/preferences",
        { displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      login(token, res.data.user); // Update context
      setStatus("✅ Preferences saved!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save preferences.");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading your preferences...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Preferences</h2>

      {/* ✅ Avatar section */}
      {user?.email && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Avatar</h3>
          <div className="flex items-center gap-4">
            <img
              src={getGravatarUrl(user.email)}
              alt="Gravatar"
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <p className="text-sm text-gray-600">
                Your avatar is managed via{" "}
                <a
                  href="https://gravatar.com"
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* ✅ Dark mode toggle (local only) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Display Settings</h3>
        <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="sr-only"
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                darkMode ? "translate-x-6" : ""
            }`}
            ></div>
        </div>
        <span className="ml-3 text-sm">Dark Mode</span>
        </label>

      </div>

      {/* ✅ Display Name form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <label className="block">
          Display Name:
          <input
            type="text"
            className="w-full border p-2 mt-1 rounded"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}

    </div>
  );
};

export default Preferences;
