const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const clinicNoteSchema = new mongoose.Schema({
  clinician: {
    type: ObjectId,
    require: [true],
  },
  patient: {
    type: ObjectId,
    require: [true],
  },
  date: String,
  note: String,
});

const ClinicNote = db.model("ClinicNote", clinicNoteSchema);
/* export model */
module.exports = ClinicNote;
