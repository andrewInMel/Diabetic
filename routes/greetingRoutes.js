const express = require("express");
const router = express.Router();

/* greeting page */
router.get("/", (req, res) => {
  res.render("index", { layout: "greeting" });
});

/* about diabetes page */
router.get("/aboutDia", (req, res) => {
  res.render("aboutDia", { layout: "greeting", style: "about.css" });
});

/* about the web site */
router.get("/aboutWebPage", (req, res) => {
  res.render("aboutWebPage", { layout: "greeting", style: "about.css" });
});

module.exports = router;
