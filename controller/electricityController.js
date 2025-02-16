const User = require("../models/User");
const getBillBasedElectricityUsage = require("../utils/electricity-usage/getBillBasedElectricityUsage");
const getElectricityUsage = require("../utils/electricity-usage/getElectricityUsage");

const calculateElectricityUsage = async (req, res) => {
    try {
        console.log("📥 Received Data:", req.body);

        const { email, method } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required." });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

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

        user.electricityHistory.push({ kWh: calculatedUsage, method, date: new Date() });
        user.green_points += method === "appliance" ? Math.round(calculatedUsage / 20) : 0;
        await user.save();

        return res.status(200).json({ method, kWh: calculatedUsage, green_points: user.green_points });

    } catch (error) {
        console.error("❌ Backend Error:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { calculateElectricityUsage };
