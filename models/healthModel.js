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
  bgl: {
    figure: String,
    time: String,
    commentId: { type: mongoose.Schema.ObjectId, ref: "Comment" },
  },
  weight: {
    figure: String,
    time: String,
    commentId: { type: mongoose.Schema.ObjectId, ref: "Comment" },
  },
  insulin: {
    figure: String,
    time: String,
    commentId: { type: mongoose.Schema.ObjectId, ref: "Comment" },
  },
  exercise: {
    figure: String,
    time: String,
    commentId: { type: mongoose.Schema.ObjectId, ref: "Comment" },
  },
});

const Health = db.model("Health", healthSchema);
/* export model */
module.exports = Health;
