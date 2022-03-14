const express = require("express");
const router = express.Router();
const passport = require("passport");

/* sign in */
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Authtication succeed");
});

/* log out */
router.get("/logout", (req, res) => {
  req.logOut();
  res.send("You are successfully logged out");
});

module.exports = router;
