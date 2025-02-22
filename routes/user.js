const express = require("express");
const { registerUser, loginUser, getUserByEmail, deductGreenPoints, increaseGreenPoints } = require("../controller/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:email", getUserByEmail);
router.post("/deduct", deductGreenPoints);
router.post("/increase", increaseGreenPoints);

module.exports = router;
