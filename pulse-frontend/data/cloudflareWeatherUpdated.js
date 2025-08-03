export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const endpoint = searchParams.get("endpoint")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const q = searchParams.get("q")
    const zip = searchParams.get("zip")
    const limit = searchParams.get("limit") || "1"

    if (!endpoint) {
      return new Response("Missing endpoint parameter", { status: 400 })
    }

    const apiKey = env.OPENWEATHER_API_KEY

    let targetUrl

    // Handle different endpoint types
    if (endpoint === 'weather') {
      // Standard weather endpoint
      targetUrl = `https://pro.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial`
      
      if (lat && lon) {
        targetUrl += `&lat=${lat}&lon=${lon}`
      } else if (zip) {
        targetUrl += `&zip=${encodeURIComponent(zip)},US`
      } else if (q) {
        targetUrl += `&q=${encodeURIComponent(q)}`
      } else {
        return new Response("Missing required location parameters", { status: 400 })
      }
    } else if (endpoint === 'geocoding') {
      // Geocoding endpoint (reverse geocoding)
      if (!lat || !lon) {
        return new Response("Geocoding requires lat and lon parameters", { status: 400 })
      }
      targetUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`
    } else if (endpoint === 'forecast') {
      if (!lat || !lon) {
        return new Response("Forecast requires lat and lon parameters", { status: 400 });
      }
      targetUrl = `https://pro.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    } else if (endpoint === 'tiles') {
      // Weather map tiles endpoint for secure tile serving
      // Based on https://openweathermap.org/api/weather-map-2
      const layer = searchParams.get('layer') || 'clouds_new';
      const z = searchParams.get('z');
      const x = searchParams.get('x');
      const y = searchParams.get('y');
      
      if (!z || !x || !y) {
        return new Response("Tiles endpoint requires z, x, y parameters", { status: 400 });
      }
      
      // Updated tile URL format based on OpenWeatherMap documentation
      targetUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;
    
    
    } else {
      // Legacy support for other endpoints (if any)
      targetUrl = `https://pro.openweathermap.org/data/2.5/${endpoint}?appid=${apiKey}&units=imperial`
      
      if (lat && lon) {
        targetUrl += `&lat=${lat}&lon=${lon}`
      } else if (zip) {
        targetUrl += `&zip=${encodeURIComponent(zip)},US`
      } else if (q) {
        targetUrl += `&q=${encodeURIComponent(q)}`
      } else {
        return new Response("Missing required location parameters", { status: 400 })
      }
    }

    try {
      const response = await fetch(targetUrl)
      
      // Handle different content types based on endpoint
      if (endpoint === 'tiles') {
        // For tile requests, return the image data as-is
        if (!response.ok) {
          // Return a transparent 1x1 pixel PNG as fallback for failed tile requests
          const transparentPng = new Uint8Array([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
            0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
          ]);
          return new Response(transparentPng, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        
        const imageData = await response.arrayBuffer()
        return new Response(imageData, {
          status: response.status,
          headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600", // Cache tiles for 1 hour
          },
        })
      } else {
        // For JSON endpoints (weather, forecast, geocoding)
        const data = await response.text()
        return new Response(data, {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }
  },
}
