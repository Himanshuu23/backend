const getLocation = require('../utils/solar-rooftop/getLocation')
const getSolarIrradiance = require('../utils/solar-rooftop/getSolarIrradiance')
const getPanelEfficiencyCapacity = require('../utils/solar-rooftop/getPanelEfficiencyCapacity')
const User = require('../models/User')

const calculateSolarPotential = async (req, res) => {
    try {
      const { state, country, rooftop_area, panel_type, email } = req.body; // Add email
  
      // Check that all fields are provided
      if (!state || !country || !rooftop_area || !panel_type || !email) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Get latitude and longitude
      const { latitude, longitude } = await getLocation(state, country);
  
      // Fetch solar irradiance
      const solar_irradiance = await getSolarIrradiance(latitude, longitude);
  
      // Get panel efficiency and capacity
      const { efficiency: panel_efficiency, capacity: panel_capacity } = getPanelEfficiencyCapacity(panel_type);
  
      // Calculate energy output
      const dailyEnergyOutput = solar_irradiance * rooftop_area * panel_efficiency;
      const monthlyEnergyOutput = dailyEnergyOutput * 30;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      // Save solar calculation in the user's history
      user.solarHistory.push({
        state,
        country,
        rooftop_area,
        panel_type,
        daily_solar_output_kWh: dailyEnergyOutput.toFixed(2),
        monthly_solar_output_kWh: monthlyEnergyOutput.toFixed(2),
        date: new Date(),
      });
  
      // Award green points
      user.green_points += Math.round(monthlyEnergyOutput / 10);
      await user.save();
  
      // Return the result
      return res.json({
        state,
        country,
        latitude,
        longitude,
        panel_type,
        panel_capacity,
        panel_efficiency: panel_efficiency.toFixed(2),
        daily_solar_output_kWh: dailyEnergyOutput.toFixed(2),
        monthly_solar_output_kWh: monthlyEnergyOutput.toFixed(2),
      });
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error: error.message });
    }
  };

module.exports = { calculateSolarPotential }
