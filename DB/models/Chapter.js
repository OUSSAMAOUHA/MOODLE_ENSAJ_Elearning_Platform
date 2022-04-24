const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },file:[
    {
      data: Buffer,
      contentType: String
    }
  ],
}, {timestamps: true});





const Chapitre = mongoose.model('Chapater', chapterSchema);
module.exports = Chapitre