
const express = require("express");
const router = express.Router();
const { sendReport } = require("../controllers/reportController");

router.post("/send-report", sendReport);

module.exports = router;