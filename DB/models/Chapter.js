const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files:[
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  ],
  video: [
    {
      
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  ]
}, {timestamps: true});





const Chapitre = mongoose.model('Chapater', chapterSchema);
module.exports = Chapitre