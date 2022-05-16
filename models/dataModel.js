const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const dataSchema = new mongoose.Schema({
  figure: {
    type: String,
    require: [true],
  },
  unit: {
    type: String,
    require: [true],
  },
  timestamp: {
    type: String,
    require: [true],
  },
  clinician: {
    type: mongoose.Schema.ObjectId,
    ref: "Clinician",
    require: [true],
  },
  patient: {
    id: { type: mongoose.Schema.ObjectId, ref: "Patient", require: [true] },
    fullName: String,
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
