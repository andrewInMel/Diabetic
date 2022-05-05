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
  BGL: { type: mongoose.Schema.ObjectId, ref: "Data" },
  Weight: { type: mongoose.Schema.ObjectId, ref: "Data" },
  Insulin: { type: mongoose.Schema.ObjectId, ref: "Data" },
  Exercise: { type: mongoose.Schema.ObjectId, ref: "Data" },
});

const Health = db.model("Health", healthSchema);
/* export model */
module.exports = Health;
