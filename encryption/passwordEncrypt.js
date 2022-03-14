const crypto = require("crypto");

/* validate user'spassword against hash in database */
function validate(password, hash, salt) {
  const newHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
}

/* generate a hash from user's password */
function genPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt: salt, hash: hash };
}

module.exports.validate = validate;
module.exports.genPassword = genPassword;
