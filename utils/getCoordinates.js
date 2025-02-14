const axios = require("axios");

const getCoordinates = async (address) => {
  if (!address || !address.street || !address.city || !address.country) {
    throw new Error("Invalid address format");
  }

  const query = `${address.street.trim()}, ${address.city.trim()}, ${address.state?.trim() || ""}, ${address.country.trim()}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  console.log("🔍 Fetching coordinates for:", url);

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "MyApp/1.0 (contact@myemail.com)" },
    });

    if (!data || data.length === 0) {
      console.error("⚠️ No results found for:", query);
      throw new Error("Invalid address - No coordinates found");
    }

    console.log("✅ Coordinates Found:", data[0].lat, data[0].lon);
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (error) {
    console.error("❌ Error fetching coordinates:", error.response?.data || error.message);
    throw new Error("Failed to fetch coordinates");
  }
};

module.exports = getCoordinates