const express = require("express");
const router = express.Router();
const patientAuth = require("./authMiddleware.js").patientAuth;
const Patient = require("../models/patientModel.js");
const Health = require("../models/healthModel.js");
const Comment = require("../models/commentModel.js");

/* patient login */
router.get("/", async (req, res) => {
  if (req.user && req.user.type === "patient") {
    /* patient data */
    const patient = req.user;
    /* health records */
    const allRecords = await Health.find({ patient: patient._id });
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
  /* create new health record */
  if (!healthDoc) {
    /* create comment */
    if (req.body.bglComment) {
      console.log("i am at bglComment");
      const newComment = new Comment({
        clinician: req.user.clinician,
        patient: patientId,
        about: "bgl",
        comment: req.body.bglComment,
      });
      const savedComment = await newComment.save();
      const newDoc = new Health({
        date: date,
        patient: patientId,
        bgl: { figure: req.body.bgl, time: time, commentId: savedComment._id },
      });
      await newDoc.save();
      res.send("new health record created");
      /* no comment entered */
    } else {
      console.log("i am at bgl");
      const newDoc = new Health({
        date: date,
        patient: patientId,
        bgl: { figure: req.body.bgl, time: time },
      });
      await newDoc.save();
      res.send("new health record created");
    }
  }
});

module.exports = router;
