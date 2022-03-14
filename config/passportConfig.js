const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const validate = require("../encryption/passwordEncrypt").validate;
const User = require("../models/userModel.js");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username })
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
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_Id, done) => {
  User.findById(_Id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});
