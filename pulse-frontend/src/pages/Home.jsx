// src/pages/Home.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getGravatarUrl } from "../utils/getGravatarUrl";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const avatarUrl = user?.email ? getGravatarUrl(user.email) : null;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Pulse</h1>

      {isAuthenticated && user ? (
        <>
          <div className="flex items-center gap-4 mb-4">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Gravatar"
                className="w-16 h-16 rounded-full border"
              />
            )}
            <div className="text-green-700 text-lg">
              ✅ Logged in as <strong>{user.displayName || user.username || user.email}</strong>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6 text-red-500 text-lg">❌ You are not logged in.</div>
      )}

      <p className="text-gray-700 mb-8 max-w-xl">
        Pulse is your personalized dashboard for essential daily info — weather, news, and entertainment — all in one place.
        Sign in to save your preferences and make it yours.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/weather"
          className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          🌤️ Check Weather
        </Link>
        <Link
          to="/news"
          className="block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          📰 View News
        </Link>
        <Link
          to="/movies"
          className="block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded text-center transition"
        >
          🎬 Explore Movies
        </Link>
      </div>
    </div>
  );
};

export default Home;
