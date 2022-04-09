/*clinician verification middleware */
module.exports.clinicianAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "clinician") {
    next();
  } else {
    res.render("clinicianLogin");
  }
};

/*patient verification middleware */
module.exports.patientAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "patient") {
    next();
  } else {
    res.render("patientLogin");
  }
};
