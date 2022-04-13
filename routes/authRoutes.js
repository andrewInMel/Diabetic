const express = require("express");
const router = express.Router();
const passport = require("passport");

/* patient sign in */
router.post(
  "/login/patient",
  passport.authenticate("patient", {
    failureRedirect: "/patient",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/patient/dashboard");
  }
);

/* clinician sign in */
router.post(
  "/login/clinician",
  passport.authenticate("clinician", {
    failureRedirect: "/clinician",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/clinician/dashboard");
  }
);

/* log out */
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
