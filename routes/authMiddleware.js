/*patient verification middleware */
module.exports.patientAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "patient") {
    next();
  } else {
    res.render("ptLogin", { layout: "greeting", style: "login.css" });
  }
};

/*clinician verification middleware */
module.exports.clinicianAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "clinician") {
    next();
  } else {
    res.render("clinLogin", { layout: "greeting", style: "login.css" });
  }
};
