const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

router.get("/", async (req, res) => {
  if (req.user && req.user.type === "clinician") {
    /* clinician data */
    const clinician = req.user;
    /* patients' records */
    const allRecords = await Patient.find({ clinician: clinician._id });
    res.render("clinicianDashboard");
  } else {
    res.render("clinicianLogin");
  }
});

/* register clinician */
router.post("/patient-register", (req, res) => {
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
        await newPatient.save();
        res.send("Clinician Account Created");
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
          type: "patient",
          email: email,
          hash: hash,
          salt: salt,
          daysRegistered: 0,
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

module.exports = router;
