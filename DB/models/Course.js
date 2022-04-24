const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  chapter: [{
    name: {
        type: String,
    }
  }],
  img:
    {
        data: Buffer,
        contentType: String
    },
}, {timestamps: true});





const Course = mongoose.model('Course', courseSchema);
module.exports = Course