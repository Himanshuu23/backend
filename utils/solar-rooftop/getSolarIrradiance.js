const axios = require('axios')

const getSolarIrradiance = async (latitude, longitude) => {
    try {
        const date = '20250131';
        const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${latitude}&start=${date}&end=${date}&format=JSON`

        // get the response for predefined date
        const nasaResponse = await axios.get(nasaUrl)
        const solar_irradiance = nasaResponse.data.properties.parameter.ALLSKY_SFC_SW_DWN[date]

        // check if response is valid or not
        if (solar_irradiance === undefined) {
            throw new Error('Solar irradiance not available')
        }

        return solar_irradiance;

    } catch (error) {
        throw new Error(`Failed to fetch solar irradiance: ${error.message}`)
    }
}

module.exports = getSolarIrradiance