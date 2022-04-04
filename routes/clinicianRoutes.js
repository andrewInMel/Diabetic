const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

/* register patient route */
router.post("/register", (req, res) => {
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
          type: "patient",
          email: email,
          hash: hash,
          salt: salt,
        });
        await newPatient.save();
        res.send("User created");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
