const express = require("express");
const { registerVendor, loginVendor, getVendorByPhone, getNearestVendor } = require("../controller/vendor");

const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get("/nearest-vendor", getNearestVendor)
router.get("/:phone", getVendorByPhone);

module.exports = router;