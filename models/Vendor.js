const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  location: { 
    type: { type: String, enum: ["Point"], default: "Point" }, 
    coordinates: { type: [Number], index: "2dsphere" }
  },
});

vendorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Vendor", vendorSchema);