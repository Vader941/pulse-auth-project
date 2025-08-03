// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainPanel from "./MainPanel";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Home from "./pages/Home"; // <-- import new home page
import Weather from "./pages/Weather";
import News from "./pages/News";       // Move/create if needed
import Movies from "./pages/Movies";   // Same here
import Preferences from "./pages/Preferences";

function App() {
  const [selectedSection, setSelectedSection] = React.useState("Welcome");

  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr] bg-white text-black dark:bg-gray-900 dark:text-white">

      <Sidebar setSelectedSection={setSelectedSection} />

      <Routes>
        <Route path="/" element={<MainPanel selectedSection={selectedSection} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/news" element={<News />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/preferences" element={<Preferences />} />

      </Routes>
    </div>
  );
}

export default App;
