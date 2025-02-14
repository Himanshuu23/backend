const express = require("express");
const { analyzeImage } = require("../controller/analyze");
const multer = require("multer")

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/suggestion", upload.single("image"), analyzeImage);

module.exports = router;