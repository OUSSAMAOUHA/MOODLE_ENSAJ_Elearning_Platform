const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var commentSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  img: {
    type: String,
  },
  content:{
      type: String,
  },
}, {timestamps: true});





const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment