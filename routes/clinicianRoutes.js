const express = require("express");
const router = express.Router();
const Clinician = require("../models/clinicianModel.js");
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

module.exports = router;
