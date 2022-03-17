/* verify if a cookie contains a valid user */
module.exports.clinicianAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "clinician") {
    next();
  } else {
    res.status(401).json("Authentication failed");
  }
};

module.exports.patientAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "patient") {
    next();
  } else {
    res.status(401).json("Authentication failed");
  }
};
