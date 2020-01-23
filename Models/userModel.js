const mongoose = require('mongoose')
const validator = require('validator');

var userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  }
})

var User = mongoose.model('User', userSchema);

var insertUser = (userData) => {
  return User.findOne(userData)
    .then(_ => {
      return User.create(userData)
    })
    .catch(err => {
      return err;
    })
}

