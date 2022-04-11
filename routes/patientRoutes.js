const express = require("express");
const router = express.Router();
const patientAuth = require("./authMiddleware.js").patientAuth;
//const Patient = require("../models/patientModel.js");
const Health = require("../models/healthModel.js");
const Data = require("../models/dataModel.js");

/* current date */
const date = new Date().toLocaleDateString();

/* patient login */
router.get("/", patientAuth, (req, res) => {
  res.redirect("/patient/dashboard");
});

/* patient dashboard */
router.get("/dashboard", patientAuth, async (req, res) => {
  /* authenticated patient */
  const patient = req.user;
  /* health records */
  const todayRecord = await Health.findOne({
    patient: patient._id,
    date: date,
  })
    .populate("bgl")
    .populate("insulin")
    .populate("weight")
    .populate("exercise")
    .lean();
  res.render("ptDashboard", {
    healthRd: todayRecord,
    patient: patient.firstName,
    style: "stylesheet.css",
  });
});

/* add Health data page */
router.get("/addHealth", patientAuth, async (req, res) => {
  /* authenticated patient */
  const patient = req.user;
  /* health records */
  const todayRecord = await Health.findOne({
    patient: patient._id,
    date: date,
  })
    .populate("bgl")
    .populate("insulin")
    .populate("weight")
    .populate("exercise")
    .lean();
  /* render the page */
  res.render("addData", {
    healthRd: todayRecord,
    patient: patient.firstName,
    style: "stylesheet.css",
  });
});

/* patient create or update health record */
router.post("/addHealth/:type", patientAuth, async (req, res) => {
  const patient = req.user;
  const dataType = req.params.type;
  const figure = req.body[dataType];
  const commnet = req.body[`${dataType}Comment`];
  /* current date & time  */
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString();
  /* find the document */
  const healthDoc = await Health.findOne({
    patient: patient._id,
    date: date,
  }).exec();
  /* create new health record */
  if (!healthDoc) {
    /* create data entry */
    const newDataEntry = new Data({
      figure: figure,
      time: time,
      clinician: patient.clinician,
      patient: patient._id,
      about: dataType,
      comment: commnet,
    });
    const savedDataEntry = await newDataEntry.save();
    /* create health record */
    const newDoc = new Health({
      date: date,
      patient: patient._id,
      [dataType]: savedDataEntry._id,
    });
    await newDoc.save();
    res.redirect("/patient/addHealth");
    /* update health record*/
  } else {
    /* create data entry */
    const newDataEntry = new Data({
      figure: figure,
      time: time,
      clinician: patient.clinician,
      patient: patient._id,
      about: dataType,
      comment: commnet,
    });
    const savedDataEntry = await newDataEntry.save();
    /* update health record */
    healthDoc[dataType] = savedDataEntry._id;
    await healthDoc.save();
    res.redirect("/patient/addHealth");
  }
});

module.exports = router;
