const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");
const Health = require("../models/healthModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

/* clinician login */
router.get("/", clinicianAuth, (req, res) => {
  res.redirect("/clinician/dashboard");
});

/* clinician dashboard */
router.get("/dashboard", clinicianAuth, async (req, res) => {
  /* clinician data */
  const clinician = req.user;
  /* patients' records */
  const allPatients = await Patient.find({ clinician: clinician._id }).lean();
  const records = await getRecords(allPatients);
  res.render("clinDashboard", {
    layout: "clinician",
    style: "clinDashboard.css",
    patients: records,
  });
});

/******
 ******
 ****** 
 BELOW DEMON ONLY
 ****** 
 ******
 ******/
router.get("/test", clinicianAuth, (req, res) => {
  res.render("test", { layout: "clinician" });
});
/******
 ******
 ****** 
 ABOVE DEMON ONLY
 ****** 
 ******
 ******/

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

/* set required time-series */
router.post("/dataset", clinicianAuth, async (req, res) => {
  const patient = await Patient.findById("624ed2cab705003aae0ad1c3").exec();
  patient.dataSet = req.body;
  patient.markModified("dataSet");
  await patient.save();
  res.send("updated");
});

/* today's date */
const date = new Date().toLocaleDateString("en-GB");

/* get health record */
const getRecords = (allPatients) =>
  Promise.all(
    allPatients.map(async (onePatient) => {
      const record = await Health.findOne({
        patient: onePatient._id,
        date: date,
      })
        .populate("bgl")
        .populate("insulin")
        .populate("weight")
        .populate("exercise")
        .lean();
      const comments = [];
      if (record) {
        if (record.bgl && record.bgl.comment) {
          comments.push(record.bgl.comment);
        }
        if (record.weight && record.weight.comment) {
          comments.push(record.weight.comment);
        }
        if (record.insulin && record.insulin.comment) {
          comments.push(record.insulin.comment);
        }
        if (record.exercise && record.exercise.comment) {
          comments.push(record.exercise.comment);
        }
      }
      return { patient: onePatient, todayRd: record, comments: comments };
    })
  );
module.exports = router;
