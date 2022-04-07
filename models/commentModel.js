const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const commentSchema = new mongoose.Schema({
  date: {
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

const Comment = db.model("Comment", commentSchema);
/* export model */
module.exports = Comment;
