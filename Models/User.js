const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstName is Required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "lastName is Required"],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, "age is Required"],
    },
    gender: {
        type: String,
        required: [true, "gender is Required"],
        enum: ['Male', 'Female'],
        trim: true,
    },
    photoUrl: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
const User = new mongoose.model('User', userSchema);


module.exports.insertUser = userObject => {
    return User.create(userObject);
};

// Delete user ready to export it recieve user id and delete it from db ..
module.exports.deleteUser = _id => {
    return User.findByIdAndDelete(_id);
};

module.exports.updateOneUser = (_id, objectCriteria) => {
    return User.findByIdAndUpdate(_id, objectCriteria)
};

module.exports.findByIdUser = _id => {
    return User.findById(_id);
};

module.exports.findUsers = (criteriaObject = {}) => {
    return User.find(criteriaObject);
};