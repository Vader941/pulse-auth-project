export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const endpoint = searchParams.get("endpoint")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const q = searchParams.get("q")
    const zip = searchParams.get("zip")

    if (!endpoint) {
      return new Response("Missing endpoint parameter", { status: 400 })
    }

    const apiKey = env.OPENWEATHER_API_KEY

    let targetUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?appid=${apiKey}&units=imperial`

    if (lat && lon) {
      targetUrl += `&lat=${lat}&lon=${lon}`
    } else if (zip) {
      targetUrl += `&zip=${encodeURIComponent(zip)},US`
    } else if (q) {
      targetUrl += `&q=${encodeURIComponent(q)}`
    } else {
      return new Response("Missing required location parameters", { status: 400 })
    }

    const response = await fetch(targetUrl)
    const data = await response.text()

    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // optionally restrict here
      },
    })
  },
}
