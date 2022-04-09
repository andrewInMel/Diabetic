const express = require("express");
const router = express.Router();
const patientAuth = require("./authMiddleware.js").patientAuth;
//const Patient = require("../models/patientModel.js");
const Health = require("../models/healthModel.js");
const Comment = require("../models/commentModel.js");

/* current date */
const date = new Date(2022, 03, 09).toLocaleDateString();

/* patient login */
router.get("/", patientAuth, (req, res) => {
  res.redirect("/patient/dashboard");
});

/* patient dashboard */
router.get("/dashboard", patientAuth, async (req, res) => {
  /* authenticated patient */
  const patient = req.user;
  /* health records */
  const todayRecord = await Health.find({
    patient: patient._id,
    date: date,
  }).lean();
  res.render("ptDashboard", {
    healthRd: todayRecord[0],
    patient: patient.firstName,
  });
});

router.get("/dashboard/addHealth", patientAuth, (req, res) => {});

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
      const newComment = new Comment({
        clinician: req.user.clinician,
        patient: patientId,
        about: "bgl",
        comment: req.body.bglComment,
      });
      const savedComment = await newComment.save();
      /* create health record */
      const newDoc = new Health({
        date: date,
        time: time,
        patient: patientId,
        bgl: { figure: req.body.bgl, time: time, commentId: savedComment._id },
      });
      await newDoc.save();
      res.send("new health record created");
      /* no comment condition */
    } else {
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

/* add a comment (test only) */

router.post("/comment/:type", async (req, res) => {
  const newComment = new Comment({
    clinician: req.user.clinician,
    patient: req.user._id,
    about: req.params.type,
    comment: req.body.comment,
  });
  await newComment.save();
  res.send("created");
});
/* add a health record (test only) */
router.post("/healthdata", async (req, res) => {
  const date = new Date();
  const newDoc = new Health({
    date: date.toLocaleDateString(),
    patient: req.user._id,
    time: date.toLocaleTimeString(),
    bgl: {
      figure: req.body.bgl,
      commentId: req.body.bglComment,
    },
    weight: {
      figure: req.body.weight,
      commentId: req.body.weightComment,
    },
    insulin: {
      figure: req.body.insulin,
      commentId: req.body.insulinComment,
    },
  });
  await newDoc.save();
  res.send("new health record created");
});

module.exports = router;
