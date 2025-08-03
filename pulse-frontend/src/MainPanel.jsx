import React from "react";
import Weather from "./pages/Weather";

function MainPanel({ selectedSection }) {
  return (
    <main className="p-4">
      {selectedSection === "Welcome" && (
        <>
          <h1 className="text-2xl font-bold">Welcome to Pulse</h1>
          <p>Select a section on the left.</p>
        </>
      )}
      {selectedSection === "Weather" && <Weather />}
      {selectedSection === "News" && <h1 className="text-xl">News Section</h1>}
      {selectedSection === "Movies" && <h1 className="text-xl">Movies Section</h1>}
    </main>
  );
}

export default MainPanel;
