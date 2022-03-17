const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validate = require("../encryption/passwordEncrypt").validate;
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");

/* Patient */
passport.use(
  "patient",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    (username, password, done) => {
      Patient.findOne({ email: username })
        .then((user) => {
          /* user not found, auth failed */
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          /* if there is a user, validate the credential */
          const isValid = validate(password, user.hash, user.salt);

          if (isValid) {
            /* password matches */
            return done(null, user);
          } else {
            /* incorrect password */
            return done(null, false, { message: "Incorrect password." });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.use(
  "clinician",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      Clinician.findOne({ email: username })
        .then((user) => {
          /* user not found, auth failed */
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          /* if there is a user, validate the credential */
          const isValid = validate(password, user.hash, user.salt);

          if (isValid) {
            /* password matches */
            return done(null, user);
          } else {
            /* incorrect password */
            return done(null, false, { message: "Incorrect password." });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: user.type });
});

passport.deserializeUser((obj, done) => {
  switch (obj.type) {
    case "patient":
      Patient.findById(obj.id)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
      break;
    case "clinician":
      Clinician.findById(obj.id)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
      break;
    default:
      done(new Error("Incorrect User Type:", obj.type), null);
      break;
  }
});
