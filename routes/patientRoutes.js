const express = require("express");
const router = express.Router();
const patientAuth = require("./authMiddleware.js").patientAuth;
const Patient = require("../models/patientModel.js");
const Health = require("../models/healthModel.js");
const Comment = require("../models/commentModel.js");

/* patient login */
router.get("/", (req, res) => {
  if (req.user) {
    res.render("dashboard");
  } else {
    res.render("login");
  }
});

/* patient update health data */
router.post("/health/bgl", patientAuth, async (req, res) => {
  const patientId = req.user._id;
  /* current date & time  */
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString();
  /* find the document */
  const healthDoc = await Health.findOne({
    patient: patientId,
    date: date,
  }).exec();

  if (!healthDoc) {
    const newComment = new Comment({
      clinician: req.user.clinician,
      patient: patientId,
      about: "bgl",
      comment: req.body.bglComment,
    });
    const savedComment = await newComment.save();
    console.log(savedComment);
    const newDoc = new Health({
      date: date,
      patient: patientId,
      bgl: { figure: req.body.bgl, time: time, commentId: savedComment._id },
    });
    const temp = await newDoc.save();
    console.log(temp);
    res.send("created");
  }
});

module.exports = router;
