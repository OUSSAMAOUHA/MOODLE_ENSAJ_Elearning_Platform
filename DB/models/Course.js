const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  visibilite: {
    type: String
  },
  filiere: {
    type: String
  },
  semester: {
    type: String
  },
  language: {
    type: String
  },
  chaptre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
  img:
    {
        type: String
    },
  creator_id: {
    type: String
  }
}, {timestamps: true});





const Course = mongoose.model('Course', courseSchema);
module.exports = Course