const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true],
  },
  type: {
    type: String,
    require: [true],
  },
  lastName: String,
  clinician: String,
  healthData: [String],
  supportMsg: String,
  dataSet: [String],
  email: {
    type: String,
    require: [true],
  },
  hash: String,
  salt: String,
});

const Patient = db.model("Patient", patientSchema);
/* export model */
module.exports = Patient;
