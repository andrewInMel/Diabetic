const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const dataSchema = new mongoose.Schema({
  figure: {
    type: String,
    require: [true],
  },
  time: {
    type: String,
    require: [true],
  },
  clinician: {
    type: mongoose.Schema.ObjectId,
    ref: "Clinician",
    require: [true],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    require: [true],
  },
  about: {
    type: String,
    require: [true],
  },
  comment: String,
});

const Data = db.model("Data", dataSchema);
/* export model */
module.exports = Data;
