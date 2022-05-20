const express = require("express");
const router = express.Router();
const passport = require("passport");

/* patient sign in */
router.post("/login/patient", (req, res, next) => {
  passport.authenticate("patient", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render("ptLogin", {
        layout: "greeting",
        style: "login.css",
        error: info.message,
      });
      return;
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect("/patient/dashboard");
    });
  })(req, res, next);
});

/* clinician sign in */
router.post("/login/clinician", (req, res, next) => {
  passport.authenticate("clinician", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render("clinLogin", {
        layout: "greeting",
        style: "login.css",
        error: info.message,
      });
      return;
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect("/clinician/dashboard");
    });
  })(req, res, next);
});

/* log out */
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
