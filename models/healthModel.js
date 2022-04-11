const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const healthSchema = new mongoose.Schema({
  date: {
    type: String,
    require: [true],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    require: [true],
  },
  bgl: { type: mongoose.Schema.ObjectId, ref: "Data" },
  weight: { type: mongoose.Schema.ObjectId, ref: "Data" },
  insulin: { type: mongoose.Schema.ObjectId, ref: "Data" },
  exercise: { type: mongoose.Schema.ObjectId, ref: "Data" },
});

const Health = db.model("Health", healthSchema);
/* export model */
module.exports = Health;
