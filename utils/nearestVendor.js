const Vendor = require("../models/Vendor");

const fetchNearestVendor = async (userLat, userLon) => {
  const nearestVendor = await Vendor.findOne({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [userLon, userLat] },
        $maxDistance: 10000,
      },
    },
  }).select("-password");

  return nearestVendor;
};

module.exports = fetchNearestVendor;