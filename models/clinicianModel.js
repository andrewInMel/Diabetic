const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const clinicianSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true],
  },
  type: {
    type: String,
    require: [true],
  },
  lastName: String,
  phoneNumber: String,
  address: String,
  birthday: String,
  imageSrc: String,
  email: {
    type: String,
    require: [true],
  },
  hash: String,
  salt: String,
});

const Clinician = db.model("Clinician", clinicianSchema);
/* export model */
module.exports = Clinician;
