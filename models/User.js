const mongoose = require("mongoose");

// Solar History Schema
const solarHistorySchema = new mongoose.Schema({
  state: String,
  country: String,
  rooftop_area: Number,
  panel_type: String,
  daily_solar_output_kWh: Number,
  monthly_solar_output_kWh: Number,
  date: { type: Date, default: Date.now }
});

// Electricity History Schema
const electricityHistorySchema = new mongoose.Schema({
  kWh: Number,
  method: { type: String, enum: ["bill", "appliance"] },
  date: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  green_points: { type: Number, default: 0 },

  // History Storage
  solarHistory: [solarHistorySchema],
  electricityHistory: [electricityHistorySchema]
});

module.exports = mongoose.model("User", userSchema);
