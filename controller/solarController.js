const getLocation = require('../utils/solar-rooftop/getLocation')
const getSolarIrradiance = require('../utils/solar-rooftop/getSolarIrradiance')
const getPanelEfficiencyCapacity = require('../utils/solar-rooftop/getPanelEfficiencyCapacity')
const User = require('../models/User')

const calculateSolarPotential = async (req, res) => {
    try {
        // Take all the inputs 
        const { state, country, rooftop_area, panel_type } = req.body

        // Check that we have all the inputs
        if (!state || !country || !rooftop_area || !panel_type ) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Get latitude and longitude
        const { latitude, longitude } = await getLocation(state, country)

        // Fetch solar irradiance
        const solar_irradiance = await getSolarIrradiance(latitude, longitude)

        // Get panel efficiency & capacity
        const { efficiency: panel_efficiency, capacity: panel_capacity } = getPanelEfficiencyCapacity(panel_type);

        // Calculate Energy Output
        const dailyEnergyOutput = solar_irradiance * rooftop_area * panel_efficiency;
        const monthlyEnergyOutput = dailyEnergyOutput * 30

        // Find the user and save the solar calculation
        const user=await User.findById(req.user)
        if(!user){
            return res.status(400).json({error:'User not found'})
        }

        // save in db
        user.solarHistory.push({
            state,
            country,
            rooftop_area,
            panel_type,
            daily_solar_output_kWh: dailyEnergyOutput.toFixed(2),
            monthly_solar_output_kWh: monthlyEnergyOutput.toFixed(2),
            date: new Date()
        })
        
        // Green points awarded : assuming that they are actually planning to keep the solar panels
        user.green_points += Math.round(monthlyEnergyOutput / 10); 
        await user.save();

        // Log actual calculated values (not `res.json()`)
        console.log(`Solar Potential for ${state}, ${country}:`);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        console.log(`Daily Solar Output: ${dailyEnergyOutput.toFixed(2)} kWh`);
        console.log(`Monthly Solar Output: ${monthlyEnergyOutput.toFixed(2)} kWh`);

        return res.json({
            state,
            country,
            latitude,
            longitude,
            panel_type,
            panel_capacity,
            panel_efficiency: panel_efficiency.toFixed(2),
            daily_solar_output_kWh: dailyEnergyOutput.toFixed(2),
            monthly_solar_output_kWh: monthlyEnergyOutput.toFixed(2)
        })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { calculateSolarPotential }
