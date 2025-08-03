import React, { useEffect, useState, useRef } from "react";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CLOUDFLARE_WORKER_URL = "https://pulse-weather.nable.workers.dev/";

const getLocationDetails = async (lat, lon) => {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}?endpoint=geocoding&lat=${lat}&lon=${lon}&limit=5`
    );
    if (response.ok) {
      const data = await response.json();
      const cityResult =
        data.find(
          (item) =>
            item.name &&
            !item.name.includes("County") &&
            !item.name.includes("Parish") &&
            !item.name.includes("ZIP") &&
            !item.name.includes("Postal") &&
            item.name !== item.state &&
            item.name !== item.country
        ) || data[0];
      return cityResult || null;
    }
  } catch (error) {
    console.log("Could not fetch detailed location info:", error);
  }
  return null;
};

const getForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}?endpoint=forecast&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch forecast data.");
    }
    const data = await response.json();
    return summarizeForecast(data.list); // summarized version
  } catch (error) {
    console.error("Forecast error:", error);
    return null;
  }
};

const summarizeForecast = (list) => {
  const dailyMap = {};
  const today = new Date().toISOString().split("T")[0];

  list.forEach((entry) => {
    const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
    if (date === today) return; // ⛔ skip today's data

    if (!dailyMap[date]) {
      dailyMap[date] = {
        temps: [],
        icons: {},
        descriptions: {},
        dt: entry.dt,
      };
    }

    const temp = entry.main.temp;
    dailyMap[date].temps.push(temp);

    const icon = entry.weather?.[0]?.icon;
    const desc = entry.weather?.[0]?.description;

    if (icon) {
      dailyMap[date].icons[icon] = (dailyMap[date].icons[icon] || 0) + 1;
    }

    if (desc) {
      dailyMap[date].descriptions[desc] = (dailyMap[date].descriptions[desc] || 0) + 1;
    }
  });

  return Object.entries(dailyMap)
    .slice(0, 5) // still only want 5 days
    .map(([date, data]) => {
      const high = Math.max(...data.temps);
      const low = Math.min(...data.temps);

      const topIcon = Object.entries(data.icons).sort((a, b) => b[1] - a[1])[0]?.[0];
      const topDesc = Object.entries(data.descriptions).sort((a, b) => b[1] - a[1])[0]?.[0];

      return {
        date,
        dt: data.dt,
        high,
        low,
        icon: topIcon,
        description: topDesc,
      };
    });
};


function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [manualOverride, setManualOverride] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setLocationInfo(null);

      try {
        if (manualOverride && searchQuery.trim() !== "") {
          const isZipCode = /^\d{5}(-\d{4})?$/.test(searchQuery.trim());
          let weatherUrl;

          if (isZipCode) {
            weatherUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&zip=${encodeURIComponent(
              searchQuery.trim()
            )}`;
          } else {
            // For city searches, don't encode commas and spaces as strictly
            // This helps with "City, State" format
            const cleanQuery = searchQuery.trim();
            weatherUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&q=${encodeURIComponent(cleanQuery)}`;
          }

          const response = await fetch(weatherUrl);
          if (!response.ok) {
            if (response.status === 404) {
              // Try alternative formats if the first search fails
              if (!isZipCode && searchQuery.includes(',')) {
                // If it contains a comma, try with country code
                const searchWithCountry = searchQuery.includes('US') ? searchQuery : `${searchQuery},US`;
                const retryUrl = `${CLOUDFLARE_WORKER_URL}?endpoint=weather&q=${encodeURIComponent(searchWithCountry)}`;
                const retryResponse = await fetch(retryUrl);
                
                if (retryResponse.ok) {
                  const data = await retryResponse.json();
                  console.log('Setting weather data:', data.name, data.coord);
                  const locationDetails = await getLocationDetails(data.coord.lat, data.coord.lon);
                  setLocationInfo(locationDetails);
                  setWeather(data);

                  const forecastData = await getForecast(data.coord.lat, data.coord.lon);
                  setForecast(forecastData);
                  setLoading(false);
                  return;
                }
              }
              throw new Error("Location not found. Please check the spelling and try again. For US cities, try format like 'Miami, FL' or 'Miami, Florida'.");
            } else if (response.status >= 500) {
              throw new Error("Weather service is temporarily unavailable. Please try again later.");
            } else {
              throw new Error(`Weather service error: ${response.status}`);
            }
          }

          const data = await response.json();
          console.log('Setting weather data:', data.name, data.coord);
          const locationDetails = await getLocationDetails(data.coord.lat, data.coord.lon);
          setLocationInfo(locationDetails);
          setWeather(data);

          const forecastData = await getForecast(data.coord.lat, data.coord.lon);
          setForecast(forecastData);
        } else if (!manualOverride) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(
                  `${CLOUDFLARE_WORKER_URL}?endpoint=weather&lat=${latitude}&lon=${longitude}`
                );

                if (!response.ok) {
                  throw new Error(`Weather service error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Setting weather data (geolocation):', data.name, data.coord);
                const locationDetails = await getLocationDetails(latitude, longitude);
                setLocationInfo(locationDetails);
                setWeather(data);

                const forecastData = await getForecast(latitude, longitude);
                setForecast(forecastData);

                setLoading(false);
              } catch (error) {
                console.error("Weather fetch error:", error);
                setError(error.message);
                setLoading(false);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              setError("Unable to get your location. Please enter a city manually.");
              setLoading(false);
            }
          );
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [manualOverride, searchQuery]);

  // Weather map useEffect with proper cleanup
  useEffect(() => {
    console.log('Map useEffect triggered, weather:', weather?.name, weather?.coord);
    
    // Cleanup existing map
    if (mapInstanceRef.current) {
      console.log('Removing existing map');
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if (weather && weather.coord) {
      console.log('Creating new map for', weather.name, 'at', weather.coord);
      
      // Add a longer delay and retry mechanism
      const createMap = () => {
        const mapContainer = document.getElementById('weather-map');
        if (!mapContainer) {
          console.log('Map container not found, retrying...');
          // Retry after another short delay
          setTimeout(createMap, 200);
          return;
        }
        
        const { lat, lon } = weather.coord;
        console.log('Setting up map at coords:', lat, lon);

        // Clear container
        mapContainer.innerHTML = '';

        // Create new map instance
        const map = L.map('weather-map').setView([lat, lon], 10);
        mapInstanceRef.current = map;
        console.log('Map created and stored in ref');

        // Add base map tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Add a marker for the current location
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`
          <div>
            <strong>${weather.name}</strong><br/>
            ${weather.weather?.[0]?.description}<br/>
            ${Math.round(weather.main?.temp)}°F
          </div>
        `).openPopup();

        // Add weather layer controls and multiple layers
        try {
          // Available weather layers with your Pro subscription
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

          // Add layer control
          const overlayMaps = {
            "☁️ Clouds": weatherLayers.clouds,
            "🌧️ Precipitation": weatherLayers.precipitation,
            "🌡️ Temperature": weatherLayers.temp,
            "🌪️ Wind Speed": weatherLayers.wind,
            "📊 Pressure": weatherLayers.pressure
          };

          // Add clouds by default
          weatherLayers.clouds.addTo(map);

          // Add layer control to map
          L.control.layers(null, overlayMaps, { 
            position: 'topright',
            collapsed: false 
          }).addTo(map);

          console.log('Weather layers and controls added');
        } catch (error) {
          console.log('Error adding weather layers:', error);
        }
      };
      
      setTimeout(createMap, 300); // Increased delay
    } else {
      console.log('No weather data or coordinates available');
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleanup: removing map');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [weather?.name, weather?.coord?.lat, weather?.coord?.lon]); // More specific dependencies

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setSearchQuery(inputValue);
      setManualOverride(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Auto-dismiss error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return <p className="text-gray-500">Loading weather data...</p>;

return (
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url('./weather-bg.png')` }}
  >
    <div className="min-h-screen px-4 sm:px-8 py-6 flex flex-col items-center">

      <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
        {/* Error Popup */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 max-w-md">
            <div className="flex items-start">
              <div className="flex-1">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="ml-2 text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter city name or ZIP code"
            className="px-3 py-2 border rounded w-full max-w-xs"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔍
          </button>
          <button
            onClick={() => {
              setManualOverride(false);
              setInputValue("");
              setSearchQuery("");
            }}
            className="ml-2 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            ↺ Use My Location
          </button>
        </div>

        {/* Current Weather & Map */}
        {weather && (
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Weather Card */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-2">
                {(() => {
                  const weatherName = weather.name || "";
                  const locationName = locationInfo?.name || "";
                  let cityName = weatherName;

                  if (
                    locationName &&
                    !locationName.includes("County") &&
                    !locationName.includes("Parish") &&
                    !locationName.includes("ZIP") &&
                    !locationName.includes("Postal") &&
                    locationName !== locationInfo?.state &&
                    locationName !== locationInfo?.country
                  ) {
                    cityName = locationName;
                  }

                  const region = locationInfo?.state || weather.sys?.country || "";
                  return `${cityName}${region ? `, ${region}` : ""}`;
                })()}
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || "Weather icon"}
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-3xl font-semibold">
                    {Math.round(weather.main?.temp || 0)}°F
                  </p>
                  <p className="capitalize text-gray-700">
                    {weather.weather?.[0]?.description || "Unknown"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Feels like {Math.round(weather.main?.feels_like || 0)}°F • Humidity{" "}
                {weather.main?.humidity || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated at{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Weather Map */}
            <div className="w-full md:w-1/2 h-80 rounded-xl shadow-lg border overflow-hidden">
              <div id="weather-map" className="h-full w-full" />
            </div>
          </div>
        )}

        {/* Forecast */}
        {forecast && (
          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold mb-2">5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded shadow p-3 text-center"
                >
                  <p className="font-semibold">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description || "Forecast icon"}
                    className="w-9 h-12 mx-auto"
                  />
                  <p className="text-sm text-gray-700 capitalize">
                    {day.description}
                  </p>
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


}

export default Weather;
