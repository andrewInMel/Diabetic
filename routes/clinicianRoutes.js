const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");
const Health = require("../models/healthModel.js");
const Data = require("../models/dataModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

/* clinician login */
router.get("/", clinicianAuth, (req, res) => {
  res.redirect("/clinician/dashboard");
});

/* clinician dashboard */
router.get("/dashboard", clinicianAuth, async (req, res) => {
  /* patients' records */
  const allPatients = await Patient.find({ clinician: req.user._id }).lean();
  const records = await getRecords(allPatients);
  /* render the page */
  res.render("clinDashboard", {
    layout: "clinician",
    style: "clinDashboard.css",
    patients: records,
    clinician: req.user,
  });
});

/* comment list */
router.get("/comments", clinicianAuth, async (req, res) => {
  /* get all comments of the clinician's patients */
  const data = await Data.find({ clinicianAuth: req.user._id })
    .sort({ _id: -1 })
    .lean();
  /* keep data that has comment */
  const commentData = data
    .filter((oneData) => oneData.comment !== "" && oneData.comment != null)
    .map((node) => {
      node.date = node._id.getTimestamp().toLocaleDateString("en-AU", {
        timeZone: "Australia/Melbourne",
      });
      return node;
    });
  /* render the page */
  res.render("clinComments", {
    layout: "clinician",
    style: "clinComments.css",
    data: commentData,
    clinician: req.user,
  });
});

/* register clinician */
router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  /* new clinician object */
  Clinician.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        res.status(500).json({ email: "User already exist" });
        console.log("find existing user: " + user);
      } else {
        /* generate password hash */
        const { hash, salt } = genPassword(password);
        /* create a new user & store it in database */
        const newClinician = new Clinician({
          firstName: req.body.firstName,
          type: "clinician",
          lastName: req.body.lastName,
          email: email,
          hash: hash,
          salt: salt,
        });
        await newClinician.save();
        res.redirect("/clinician");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

/* register patient */
router.post("/patient-register", clinicianAuth, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Patient.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        res.status(500).json({ email: "User already exist" });
        console.log("find existing user: " + user);
      } else {
        /* generate password hash */
        const { hash, salt } = genPassword(password);
        /* create a new user & store it in database */
        const newPatient = new Patient({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          clinician: req.user._id,
          gender: req.body.gender,
          dob: req.body.dob,
          type: "patient",
          email: email,
          hash: hash,
          salt: salt,
          startDate: new Date().getTime(),
          dayscompleted: 0,
        });
        await newPatient.save();
        res.send("Patient Account Created");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

/* clinician setting */
router.get("/settings", clinicianAuth, (req, res) => {
  /* render the page */
  res.render("clinSettings", {
    layout: "clinician",
    style: "clinSettings.css",
    clinician: req.user,
  });
});

/* set required time-series */
router.post("/dataset", clinicianAuth, async (req, res) => {
  const patient = await Patient.findById("624ed2cab705003aae0ad1c3").exec();
  patient.dataSet = req.body;
  patient.markModified("dataSet");
  await patient.save();
  res.send("updated");
});

/* get health record */
const getRecords = (allPatients) => {
  /* current date */
  const date = new Date().toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
  });
  /* map through patients' array, return desired data object */
  return Promise.all(
    allPatients.map(async (onePatient) => {
      const record = await Health.findOne({
        patient: onePatient._id,
        date: date,
      })
        .populate("BGL")
        .populate("Insulin")
        .populate("Weight")
        .populate("Exercise")
        .lean();
      const comments = [];
      if (record) {
        if (record.BGL && record.BGL.comment) {
          comments.push(record.BGL.comment);
        }
        if (record.Weight && record.Weight.comment) {
          comments.push(record.Weight.comment);
        }
        if (record.Insulin && record.Insulin.comment) {
          comments.push(record.Insulin.comment);
        }
        if (record.Exercise && record.Exercise.comment) {
          comments.push(record.Exercise.comment);
        }
      }
      return { patient: onePatient, todayRd: record, comments: comments };
    })
  );
};

module.exports = router;