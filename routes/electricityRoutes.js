const express = require("express");
const {calculateElectricityUsage}=require('../controller/electricityController')


const router = express.Router();

router.post("/electricityUsage", calculateElectricityUsage);

module.exports = router;
