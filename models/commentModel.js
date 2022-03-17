const mongoose = require("mongoose");
const db = require("../config/databaseConfig");

/* user schema */
const commentSchema = new mongoose.Schema({
  clinician: {
    type: String,
    require: [true],
  },
  comment: String,
});

const Comment = db.model("Comment", commentSchema);
/* export model */
module.exports = Comment;
