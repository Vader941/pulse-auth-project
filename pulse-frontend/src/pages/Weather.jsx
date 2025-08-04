// WEATHER PAGE COMPONENT
// This is a comprehensive weather application that shows current weather and forecasts
// Features: GPS location detection, manual city search, interactive maps, and 5-day forecasts

// Import React hooks and external libraries
import React, { useEffect, useState, useRef } from "react";
import 'leaflet/dist/leaflet.css'; // CSS styles for the Leaflet mapping library
import L from 'leaflet'; // Leaflet - library for interactive maps

// LEAFLET ICON FIX
// Leaflet markers don't work properly in React by default, so we fix them here
// This removes the broken default icon configuration
delete L.Icon.Default.prototype._getIconUrl;

// Set up proper marker icons using CDN links
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', // High-res icon
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png', // Standard icon
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png', // Shadow image
});

// API ENDPOINT CONFIGURATION
// Cloudflare Worker that acts as a proxy to the OpenWeatherMap API
// This avoids CORS issues and can add authentication/rate limiting
const CLOUDFLARE_WORKER_URL = "https://pulse-weather.nable.workers.dev/";

// LOCATION DETAILS FUNCTION
// This function takes GPS coordinates and tries to get a human-readable location name
// It filters out administrative regions to get actual city names
const getLocationDetails = async (lat, lon) => {
  try {
    // REVERSE GEOCODING API CALL - Convert coordinates to place names
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}?endpoint=geocoding&lat=${lat}&lon=${lon}&limit=5`
    );
    
    if (response.ok) {
      const data = await response.json(); // Get array of possible locations
      
      // FILTER LOGIC - Find the best city name from the results
      // Skip administrative regions like "County", "Parish", etc.
      const cityResult =
        data.find(
          (item) =>
            item.name &&
            !item.name.includes("County") &&    // Skip county names
            !item.name.includes("Parish") &&    // Skip parish names  
            !item.name.includes("ZIP") &&       // Skip ZIP code areas
            !item.name.includes("Postal") &&    // Skip postal areas
            item.name !== item.state &&         // Skip if name is same as state
            item.name !== item.country          // Skip if name is same as country
        ) || data[0]; // Fallback to first result if no good city found
      
      return cityResult || null;
    }
  } catch (error) {
    console.log("Could not fetch detailed location info:", error);
  }
  return null; // Return null if anything goes wrong
};

// FORECAST DATA FUNCTION
// Gets 5-day weather forecast for given coordinates
const getForecast = async (lat, lon) => {
  try {
    // API CALL - Request forecast data from our weather service
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}?endpoint=forecast&lat=${lat}&lon=${lon}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch forecast data.");
    }
    
    const data = await response.json();
    return summarizeForecast(data.list); // Process the raw forecast data
  } catch (error) {
    console.error("Forecast error:", error);
    return null;
  }
};

// FORECAST PROCESSING FUNCTION
// The API returns hourly data, but we want daily summaries
// This function groups hourly forecasts by day and calculates daily highs/lows
const summarizeForecast = (list) => {
  const dailyMap = {}; // Object to store data for each day
  const today = new Date().toISOString().split("T")[0]; // Get today's date string

  // PROCESS EACH FORECAST ENTRY
  list.forEach((entry) => {
    // Convert Unix timestamp to date string (YYYY-MM-DD format)
    const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
    
    if (date === today) return; // ⛔ Skip today's data (we show current weather instead)

    // CREATE NEW DAY ENTRY if this is the first forecast for this date
    if (!dailyMap[date]) {
      dailyMap[date] = {
        temps: [],        // Array to collect all temperatures for this day
        icons: {},        // Object to count weather icon occurrences
        descriptions: {}, // Object to count weather description occurrences
        dt: entry.dt,     // Unix timestamp for this day
      };
    }

    // COLLECT TEMPERATURE DATA
    const temp = entry.main.temp;
    dailyMap[date].temps.push(temp); // Add this temperature to the day's list

    // COLLECT WEATHER ICON DATA (most common icon will represent the day)
    const icon = entry.weather?.[0]?.icon;
    const desc = entry.weather?.[0]?.description;

    if (icon) {
      // Count how many times this icon appears for this day
      dailyMap[date].icons[icon] = (dailyMap[date].icons[icon] || 0) + 1;
    }

    if (desc) {
      // Count how many times this description appears for this day
      dailyMap[date].descriptions[desc] = (dailyMap[date].descriptions[desc] || 0) + 1;
    }
  });

  // CONVERT COLLECTED DATA TO FINAL FORECAST FORMAT
  return Object.entries(dailyMap)
    .slice(0, 5) // Only want 5 days of forecast
    .map(([date, data]) => {
      // CALCULATE DAILY HIGH AND LOW TEMPERATURES
      const high = Math.max(...data.temps); // Highest temperature for this day
      const low = Math.min(...data.temps);  // Lowest temperature for this day

      // FIND MOST COMMON ICON AND DESCRIPTION
      // Sort by count (descending) and take the first (most frequent)
      const topIcon = Object.entries(data.icons).sort((a, b) => b[1] - a[1])[0]?.[0];
      const topDesc = Object.entries(data.descriptions).sort((a, b) => b[1] - a[1])[0]?.[0];

      return {
        date,           // Date string (YYYY-MM-DD)
        dt: data.dt,    // Unix timestamp
        high,           // High temperature for the day
        low,            // Low temperature for the day
        icon: topIcon,  // Most common weather icon
        description: topDesc, // Most common weather description
      };
    });
};


// MAIN WEATHER COMPONENT
// This is the main function component that displays weather information
function Weather() {
  // STATE VARIABLES - Store all the data our component needs
  
  // Current weather data (temperature, conditions, etc.)
  const [weather, setWeather] = useState(null);
  
  // 5-day forecast data
  const [forecast, setForecast] = useState(null);
  
  // What user types in search box
  const [inputValue, setInputValue] = useState("");
  
  // The actual search query being used for API calls
  const [searchQuery, setSearchQuery] = useState("");
  
  // Whether user is manually searching (true) or using GPS location (false)
  const [manualOverride, setManualOverride] = useState(false);
  
  // Whether we're currently loading data
  const [loading, setLoading] = useState(true);
  
  // Any error messages to display to user
  const [error, setError] = useState(null);
  
  // Detailed location information (city, state, etc.)
  const [locationInfo, setLocationInfo] = useState(null);
  
  // React refs for the map functionality
  const mapRef = useRef(null);           // Reference to map container DOM element
  const mapInstanceRef = useRef(null);   // Reference to Leaflet map instance

  // MAIN DATA FETCHING EFFECT
  // This runs whenever the user searches for a new location or when component first loads
  useEffect(() => {
    // ASYNC FUNCTION to fetch weather data
    const fetchWeatherData = async () => {
      // RESET UI STATE - Start fresh for each search
      setLoading(true);
      setError(null);
      setLocationInfo(null);

      try {
        // MANUAL SEARCH PATH - User entered a city name or ZIP code
        if (manualOverride && searchQuery.trim() !== "") {
          // DETECT SEARCH TYPE - Check if input is a ZIP code (5 digits) or city name
          const isZipCode = /^\d{5}(-\d{4})?$/.test(searchQuery.trim());
          let weatherUrl;

          // BUILD API URL based on search type
          if (isZipCode) {
            // ZIP CODE SEARCH - Use zip parameter
            weatherUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&zip=${encodeURIComponent(
              searchQuery.trim()
            )}`;
          } else {
            // CITY NAME SEARCH - Use q (query) parameter
            const cleanQuery = searchQuery.trim();
            weatherUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&q=${encodeURIComponent(cleanQuery)}`;
          }

          // MAKE API REQUEST
          const response = await fetch(weatherUrl);
          
          // ERROR HANDLING with specific error messages
          if (!response.ok) {
            if (response.status === 404) {
              // LOCATION NOT FOUND - Try alternative search formats
              if (!isZipCode && searchQuery.includes(',')) {
                // For city searches with commas, try adding country code
                const searchWithCountry = searchQuery.includes('US') ? searchQuery : `${searchQuery},US`;
                const retryUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&q=${encodeURIComponent(searchWithCountry)}`;
                const retryResponse = await fetch(retryUrl);
                
                if (retryResponse.ok) {
                  // SUCCESS ON RETRY - Process the data
                  const data = await retryResponse.json();
                  console.log('Setting weather data:', data.name, data.coord);
                  
                  // Get detailed location info and set all state
                  const locationDetails = await getLocationDetails(data.coord.lat, data.coord.lon);
                  setLocationInfo(locationDetails);
                  setWeather(data);

                  // Get forecast data
                  const forecastData = await getForecast(data.coord.lat, data.coord.lon);
                  setForecast(forecastData);
                  setLoading(false);
                  return;
                }
              }
              // If retry failed or not applicable, show helpful error message
              throw new Error("Location not found. Please check the spelling and try again. For US cities, try format like 'Miami, FL' or 'Miami, Florida'.");
            } else if (response.status >= 500) {
              // SERVER ERROR
              throw new Error("Weather service is temporarily unavailable. Please try again later.");
            } else {
              // OTHER HTTP ERRORS
              throw new Error(`Weather service error: ${response.status}`);
            }
          }

          // SUCCESS - Process the weather data
          const data = await response.json();
          console.log('Setting weather data:', data.name, data.coord);
          
          // Get additional location details and forecast
          const locationDetails = await getLocationDetails(data.coord.lat, data.coord.lon);
          setLocationInfo(locationDetails);
          setWeather(data);

          const forecastData = await getForecast(data.coord.lat, data.coord.lon);
          setForecast(forecastData);
          
        } else if (!manualOverride) {
          // GPS LOCATION PATH - Use browser's geolocation API
          navigator.geolocation.getCurrentPosition(
            // SUCCESS CALLBACK - User allowed location access
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                
                // Get weather for user's current location
                const response = await fetch(
                  `${CLOUDFLARE_WORKER_URL}?endpoint=weather&lat=${latitude}&lon=${longitude}`
                );

                if (!response.ok) {
                  throw new Error(`Weather service error: ${response.status}`);
                }

                // Process GPS-based weather data
                const data = await response.json();
                console.log('Setting weather data (geolocation):', data.name, data.coord);
                
                const locationDetails = await getLocationDetails(latitude, longitude);
                setLocationInfo(locationDetails);
                setWeather(data);

                // Get forecast for GPS location
                const forecastData = await getForecast(latitude, longitude);
                setForecast(forecastData);

                setLoading(false);
              } catch (error) {
                console.error("Weather fetch error:", error);
                setError(error.message);
                setLoading(false);
              }
            },
            // ERROR CALLBACK - User denied location or GPS failed
            (error) => {
              console.error("Geolocation error:", error);
              setError("Unable to get your location. Please enter a city manually.");
              setLoading(false);
            }
          );
          return; // Exit early for GPS path
        }
        setLoading(false);
      } catch (error) {
        // GENERAL ERROR HANDLING - Catch any other errors
        console.error("Weather fetch error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Actually call the fetch function
    fetchWeatherData();
  }, [manualOverride, searchQuery]); // Run effect when these dependencies change

  // MAP SETUP EFFECT
  // This creates and manages the interactive weather map
  // Runs whenever weather data changes (new location selected)
  useEffect(() => {
    console.log('Map useEffect triggered, weather:', weather?.name, weather?.coord);
    
    // CLEANUP EXISTING MAP - Prevent multiple maps from being created
    if (mapInstanceRef.current) {
      console.log('Removing existing map');
      mapInstanceRef.current.remove(); // Destroy old map
      mapInstanceRef.current = null;
    }

    // CREATE NEW MAP if we have weather data with coordinates
    if (weather && weather.coord) {
      console.log('Creating new map for', weather.name, 'at', weather.coord);
      
      // DELAYED MAP CREATION - Give DOM time to update
      const createMap = () => {
        const mapContainer = document.getElementById('weather-map');
        if (!mapContainer) {
          console.log('Map container not found, retrying...');
          // Retry if container not ready yet
          setTimeout(createMap, 200);
          return;
        }
        
        const { lat, lon } = weather.coord;
        console.log('Setting up map at coords:', lat, lon);

        // Clear any existing content in map container
        mapContainer.innerHTML = '';

        // CREATE LEAFLET MAP INSTANCE
        const map = L.map('weather-map').setView([lat, lon], 10); // Zoom level 10
        mapInstanceRef.current = map; // Store reference for cleanup
        console.log('Map created and stored in ref');

        // ADD BASE MAP TILES (the actual map background)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors', // Required attribution
        }).addTo(map);

        // ADD LOCATION MARKER
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`
          <div>
            <strong>${weather.name}</strong><br/>
            ${weather.weather?.[0]?.description}<br/>
            ${Math.round(weather.main?.temp)}°F
          </div>
        `).openPopup(); // Show popup immediately

        // ADD WEATHER OVERLAY LAYERS
        // These show weather data like clouds, precipitation, etc. on top of the map
        try {
          // DEFINE WEATHER LAYERS - Different types of weather data overlays
          const weatherLayers = {
            clouds: L.tileLayer(
              `${CLOUDFLARE_WORKER_URL}?endpoint=tiles&layer=clouds_new&z={z}&x={x}&y={y}`,
              { attribution: 'Weather data © OpenWeatherMap', opacity: 0.5 }
            ),
            precipitation: L.tileLayer(
              `${CLOUDFLARE_WORKER_URL}?endpoint=tiles&layer=precipitation_new&z={z}&x={x}&y={y}`,
              { attribution: 'Weather data © OpenWeatherMap', opacity: 0.6 }
            ),
            pressure: L.tileLayer(
              `${CLOUDFLARE_WORKER_URL}?endpoint=tiles&layer=pressure_new&z={z}&x={x}&y={y}`,
              { attribution: 'Weather data © OpenWeatherMap', opacity: 0.5 }
            ),
            wind: L.tileLayer(
              `${CLOUDFLARE_WORKER_URL}?endpoint=tiles&layer=wind_new&z={z}&x={x}&y={y}`,
              { attribution: 'Weather data © OpenWeatherMap', opacity: 0.5 }
            ),
            temp: L.tileLayer(
              `${CLOUDFLARE_WORKER_URL}?endpoint=tiles&layer=temp_new&z={z}&x={x}&y={y}`,
              { attribution: 'Weather data © OpenWeatherMap', opacity: 0.5 }
            )
          };

          // LAYER CONTROL SETUP - Let users toggle different weather overlays
          const overlayMaps = {
            "☁️ Clouds": weatherLayers.clouds,
            "🌧️ Precipitation": weatherLayers.precipitation,
            "🌡️ Temperature": weatherLayers.temp,
            "🌪️ Wind Speed": weatherLayers.wind,
            "📊 Pressure": weatherLayers.pressure
          };

          // Add clouds layer by default (users can toggle others on/off)
          weatherLayers.clouds.addTo(map);

          // Add layer control widget to map (top-right corner)
          L.control.layers(null, overlayMaps, { 
            position: 'topright',  // Position in top-right corner
            collapsed: false       // Keep control panel open by default
          }).addTo(map);

          console.log('Weather layers and controls added');
        } catch (error) {
          console.log('Error adding weather layers:', error);
        }
      };
      
      setTimeout(createMap, 300); // Wait 300ms for DOM to be ready
    } else {
      console.log('No weather data or coordinates available');
    }

    // CLEANUP FUNCTION - Runs when component unmounts or dependencies change
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleanup: removing map');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [weather?.name, weather?.coord?.lat, weather?.coord?.lon]); // Run when location changes

  // SEARCH HANDLER - Triggered when user clicks search button
  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setSearchQuery(inputValue);    // Set the query to trigger API call
      setManualOverride(true);       // Switch to manual search mode
    }
  };

  // KEYBOARD HANDLER - Allow searching by pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ERROR DISMISSAL - Allow user to manually close error messages
  const clearError = () => {
    setError(null);
  };

  // AUTO-DISMISS ERROR EFFECT - Automatically hide errors after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10 seconds
      
      // Cleanup timer if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  // LOADING STATE - Show loading message while fetching data
  if (loading) return <p className="text-gray-500">Loading weather data...</p>;

// MAIN COMPONENT RENDER - The visual layout of the weather page
return (
  // FULL-SCREEN BACKGROUND CONTAINER with weather background image
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url('./weather-bg.png')` }} // Background image
  >
    {/* MAIN CONTENT WRAPPER with responsive padding */}
    <div className="min-h-screen px-4 sm:px-8 py-6 flex flex-col items-center">

      {/* CENTERED CONTENT CONTAINER with max width */}
      <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
        
        {/* ERROR POPUP - Fixed position overlay that appears when there's an error */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 max-w-md">
            <div className="flex items-start">
              <div className="flex-1">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              {/* CLOSE BUTTON for error popup */}
              <button
                onClick={clearError}
                className="ml-2 text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* SEARCH BAR SECTION - Input field and buttons for location search */}
        <div className="flex items-center gap-2 mb-4">
          
          {/* SEARCH INPUT FIELD */}
          <input
            type="text"
            placeholder="Enter city name or ZIP code" // Helpful placeholder text
            className="px-3 py-2 border rounded w-full max-w-xs"
            value={inputValue} // Controlled input
            onChange={(e) => setInputValue(e.target.value)} // Update state when user types
            onKeyPress={handleKeyPress} // Allow Enter key to trigger search
          />
          
          {/* SEARCH BUTTON */}
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔍 {/* Search icon emoji */}
          </button>
          
          {/* RESET TO GPS LOCATION BUTTON */}
          <button
            onClick={() => {
              // Reset to GPS-based location detection
              setManualOverride(false); // Switch back to GPS mode
              setInputValue("");        // Clear search input
              setSearchQuery("");       // Clear search query
            }}
            className="ml-2 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            ↺ Use My Location {/* Refresh icon + text */}
          </button>
        </div>

        {/* CURRENT WEATHER & MAP SECTION - Only shown when we have weather data */}
        {weather && (
          <div className="flex flex-col md:flex-row gap-6 w-full">
            
            {/* WEATHER INFORMATION CARD - Left side on desktop, top on mobile */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-1/2">
              
              {/* LOCATION TITLE - Smart formatting of city and region */}
              <h2 className="text-xl font-bold mb-2">
                {(() => {
                  // COMPLEX LOCATION FORMATTING LOGIC
                  // Try to show the best possible location name
                  const weatherName = weather.name || "";
                  const locationName = locationInfo?.name || "";
                  let cityName = weatherName;

                  // Use detailed location name if it's better than weather API name
                  if (
                    locationName &&
                    !locationName.includes("County") &&   // Skip administrative regions
                    !locationName.includes("Parish") &&
                    !locationName.includes("ZIP") &&
                    !locationName.includes("Postal") &&
                    locationName !== locationInfo?.state &&
                    locationName !== locationInfo?.country
                  ) {
                    cityName = locationName;
                  }

                  // Add state/country for context
                  const region = locationInfo?.state || weather.sys?.country || "";
                  return `${cityName}${region ? `, ${region}` : ""}`;
                })()}
              </h2>

              {/* CURRENT WEATHER DISPLAY - Icon, temperature, and description */}
              <div className="flex items-center gap-4">
                
                {/* WEATHER ICON from OpenWeatherMap */}
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || "Weather icon"}
                  className="w-16 h-16"
                />
                
                {/* TEMPERATURE AND DESCRIPTION */}
                <div>
                  <p className="text-3xl font-semibold">
                    {Math.round(weather.main?.temp || 0)}°F
                  </p>
                  <p className="capitalize text-gray-700">
                    {weather.weather?.[0]?.description || "Unknown"}
                  </p>
                </div>
              </div>

              {/* ADDITIONAL WEATHER DETAILS */}
              <p className="text-sm text-gray-600 mt-2">
                Feels like {Math.round(weather.main?.feels_like || 0)}°F • Humidity{" "}
                {weather.main?.humidity || 0}%
              </p>
              
              {/* LAST UPDATED TIMESTAMP */}
              <p className="text-xs text-gray-500 mt-1">
                Last updated at{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* WEATHER MAP CONTAINER - Right side on desktop, bottom on mobile */}
            <div className="w-full md:w-1/2 h-80 rounded-xl shadow-lg border overflow-hidden">
              {/* MAP ELEMENT - Leaflet map gets rendered here */}
              <div id="weather-map" className="h-full w-full" />
            </div>
          </div>
        )}

        {/* 5-DAY FORECAST SECTION - Only shown when we have forecast data */}
        {forecast && (
          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold mb-2">5-Day Forecast</h3>
            
            {/* FORECAST GRID - Responsive grid that adjusts to screen size */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {/* MAP THROUGH FORECAST ARRAY - Create one card for each day */}
              {forecast.map((day, index) => (
                <div
                  key={index} // React needs unique key for each item in list
                  className="bg-white rounded shadow p-3 text-center"
                >
                  {/* DATE DISPLAY - Format date in human-readable way */}
                  <p className="font-semibold">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short", // Mon, Tue, etc.
                      month: "short",   // Jan, Feb, etc.
                      day: "numeric",   // 1, 2, 3, etc.
                    })}
                  </p>
                  
                  {/* WEATHER ICON for the day */}
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description || "Forecast icon"}
                    className="w-9 h-12 mx-auto" // mx-auto centers the image
                  />
                  
                  {/* WEATHER DESCRIPTION */}
                  <p className="text-sm text-gray-700 capitalize">
                    {day.description}
                  </p>
                  
                  {/* HIGH AND LOW TEMPERATURES */}
                  <p className="text-sm">High: {Math.round(day.high)}°F</p>
                  <p className="text-sm">Low: {Math.round(day.low)}°F</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

} // End of Weather function component

// EXPORT - Makes this component available for import in other files
export default Weather;

/*
WEATHER COMPONENT SUMMARY:

This comprehensive weather component provides:

1. LOCATION DETECTION:
   - GPS-based automatic location detection
   - Manual city/ZIP code search with intelligent formatting
   - Fallback error handling for location issues

2. WEATHER DATA:
   - Current conditions (temperature, humidity, description)
   - 5-day forecast with daily highs/lows
   - Weather icons from OpenWeatherMap

3. INTERACTIVE MAP:
   - Leaflet-powered map with location marker
   - Multiple weather overlay layers (clouds, precipitation, temperature, etc.)
   - User-controllable layer toggles

4. USER EXPERIENCE:
   - Responsive design (mobile-friendly)
   - Error handling with helpful messages
   - Auto-dismissing error popups
   - Loading states and smooth transitions

5. TECHNICAL FEATURES:
   - React hooks for state management
   - useEffect for data fetching and cleanup
   - useRef for DOM element references
   - Proper cleanup to prevent memory leaks
   - API integration through Cloudflare Worker proxy

The component demonstrates advanced React patterns including:
- Complex state management
- Side effects with cleanup
- Ref management for third-party libraries
- Error boundaries and user feedback
- Responsive design principles
*/
