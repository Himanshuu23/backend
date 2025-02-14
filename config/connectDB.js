const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB Connected! 🍻");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
