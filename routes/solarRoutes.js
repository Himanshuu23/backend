const express = require("express");
const { calculateSolarPotential } = require("../controller/solarController");

const router = express.Router();
router.post("/solarPotential", calculateSolarPotential);

module.exports = router;
