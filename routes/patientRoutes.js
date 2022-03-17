const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const patientAuth = require("./authMiddleware.js").patientAuth;

/* patient register route */
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

/* patient update health data */
router.post("/health", patientAuth, (req, res) => {
  res.send("auth test passed");
});

module.exports = router;
