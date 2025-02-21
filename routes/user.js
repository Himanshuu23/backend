const express = require("express");
const { registerUser, loginUser, getUserByEmail, deductGreenPoints } = require("../controller/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:email", getUserByEmail);
router.post("/user/deduct", deductGreenPoints);

module.exports = router;