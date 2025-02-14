const fs = require("fs");
const path = require("path");
const axios = require("axios");

const analyzeImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        const apiKey = process.env.IMAGGA_API_KEY;
        const apiSecret = process.env.IMAGGA_API_SECRET;
        const imageBuffer = req.file.buffer.toString("base64");

        const response = await axios.post(
            "https://api.imagga.com/v2/tags",
            `image_base64=${encodeURIComponent(imageBuffer)}`,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                auth: { username: apiKey, password: apiSecret },
            }
        );

        const tags = response.data.result.tags.map(tag => tag.tag.en.toLowerCase());

        const jsonData = fs.readFileSync(path.join(__dirname, "../data.json"), "utf-8");
        const data = JSON.parse(jsonData).wasteData;

        const matchedItem = data.find(item =>
            tags.some(tag => new RegExp(tag, "i").test(item.productName))
        );

        if (!matchedItem) return res.status(404).json({ error: "No matching product found" });

        res.json({ productName: matchedItem.productName, wasteInfo: matchedItem });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error processing image" });
    }
};

module.exports = { analyzeImage };
