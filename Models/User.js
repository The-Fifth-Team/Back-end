const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
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
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  }
});

const User = new mongoose.model('User', userSchema);
module.exports.User = User

/*******************************
 *******************************
 ********** HELPERS ************
 *******************************
 *******************************/

/**
 * @function Helpers ...
 * @param {*} All 
 * @returns all of them return a promise to be handled later on
 */


// This function works now and ready to export
// but we might add the biometrically so it needs more work!
module.exports.insertUser = ( userData ) => {
  return User.create(userData);
};

// Delete user ready to export it recieve user id and delete it from db ..
module.exports.deleteUser = ( userId ) => {
  return User.findByIdAndDelete( userId )
};

// This function accept userId, as target and object criteria
// ex { name: 'Ali jalal' } this will target the user by id
// and set his name to the object criteria ...
module.exports.updateOneUser = (userId, objectCriteria) => {
  return User.findByIdAndUpdate({ _id: userId },  objectCriteria )
};

// Retreve user by Id
module.exports.getUser = ( userId ) => {
  return User.findOne({ _id: userId })
};

// Retrieve all users
module.exports.getUsers = () => {
  return User.find()
};

