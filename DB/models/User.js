const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require("bcryptjs")


var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Email is invalid")
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  img:
    {
        data: Buffer,
        contentType: String
    },
  courses: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
  ]
}, {timestamps: true});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}


userSchema.pre('save', async function(next){
  const user = this
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})
const User = mongoose.model('User', userSchema);
module.exports = User