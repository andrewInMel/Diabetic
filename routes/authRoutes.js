const express = require("express");
const router = express.Router();
const passport = require("passport");

/* patient sign in */
router.post("/login/patient", passport.authenticate("patient"), (req, res) => {
  res.render("dashboard");
});

/* clinician sign in */
router.post(
  "/login/clinician",
  passport.authenticate("clinician"),
  (req, res) => {
    res.send("Authtication succeed");
  }
);

/* log out */
router.get("/logout", (req, res) => {
  req.logOut();
  res.send("You are successfully logged out");
});

module.exports = router;
