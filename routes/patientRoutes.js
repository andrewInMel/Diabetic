const express = require("express");
const router = express.Router();
const patientAuth = require("./authMiddleware.js").patientAuth;
const Patient = require("../models/patientModel.js");
const Health = require("../models/healthModel.js");

/* patient update health data */
router.post("/health/:type", patientAuth, async (req, res) => {
  const patientId = req.user.id;
  /* current date & time  */
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString();
  /* find the document */
  const healthDoc = await Health.findOne({
    patient: patientId,
    date: date,
  }).exec();
});

module.exports = router;
