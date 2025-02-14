const axios = require('axios')

// Get the latitude and longitude -> req. to get solar-irradiance
const getLocation = async (state, country) => {
    try {
        // check for input given or not
        if (!state || !country) {
            throw new Error('Please enter the State and Country')
        }

        // request the api with input as query
        const geoUrl = `https://nominatim.openstreetmap.org/search?state=${state}&country=${country}&format=json&limit=1`;
        const geoResponse = await axios.get(geoUrl)

        // check the sent response sent or not
        if (geoResponse.data.length === 0) {
            throw new Error('Location Not Found')
        }

        const { lat, lon } = geoResponse.data[0];
        // parse the string to float and return back at final end point
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) }

    } catch (error) {
        throw new Error(`Failed to fetch location : ${error.message}`)
    }
}

module.exports = getLocation