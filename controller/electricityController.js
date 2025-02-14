const getBillBasedElectricityUsage = require("../utils/electricity-usage/getBillBasedElectricityUsage");
const getElectricityUsage = require("../utils/electricity-usage/getElectricityUsage");
const User = require("../models/User");

const calculateElectricityUsage = async (req, res) => {
    try {
        console.log("📥 Received Data:", req.body);
        const { method } = req.body;

        let calculatedUsage;

        if (method === "appliance") {
            const { appliances } = req.body;
            if (!Array.isArray(appliances) || appliances.length === 0) {
                return res.status(400).json({ error: "Please choose at least one appliance." });
            }
            calculatedUsage = getElectricityUsage({ appliances });
        } else if (method === "bill") {
            const { billAmount, state, unitPrice } = req.body;
            if (!billAmount) {
                return res.status(400).json({ error: "Please fill the required details." });
            }
            calculatedUsage = getBillBasedElectricityUsage({ billAmount, state, unitPrice });
        } else {
            return res.status(400).json({ error: "Invalid selection" });
        }

        // ✅ Find user and save the electricity calculation
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.electricityHistory.push({
            kWh: calculatedUsage,
            method,
            date: new Date()
        });

        user.green_points += method === "appliance" ? Math.round(calculatedUsage / 20) : 0;
        await user.save();

        return res.status(200).json({ method, kWh: calculatedUsage, green_points: user.green_points });

    } catch (error) {
        console.error("❌ Backend Error:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { calculateElectricityUsage }; // ✅ Ensure it's exported correctly


