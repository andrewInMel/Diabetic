const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const healthSchema = new mongoose.Schema({
  date: {
    type: String,
    require: [true],
  },
  patient: {
    type: String,
    require: [true],
  },
  bgl: { figure: String, time: String, comment_id: String },
  weight: { figure: String, time: String, comment_id: String },
  insulin: { figure: String, time: String, comment_id: String },
  exercise: { figure: String, time: String, comment_id: String },
});

const Health = db.model("Health", healthSchema);
/* export model */
module.exports = Health;
