const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require('crypto');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
const AdminSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "First Name is Required"],
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Must be a valid email"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetTokenExpired: Date
});

/**
 * @function pre invocation hashes the password of every record being saved to the database
 * @note the second parameter MUST BE a normal ES5 function , in order to set the scope for @this this to points to the respective record
 */
AdminSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

/**
 * @function createPasswordResetToken used to create a password reset token, save it to that specific instance, and set the expired time for it to 15min, and returns that token
 * @return {string} resetToken the password reset token created for this specific instance
 * @note the second parameter MUST BE a normal ES5 function , in order to set the scope for @code{this} to points to the respective record
 */
AdminSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpired = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
const Admin = mongoose.model("Admin", AdminSchema);

/**
 * @function createAdmin accepts an admin object, and persists it in the database
 * @param {object} admin the admin object to added in the database
 * @return {Promise<object>} Promise which contain the admin added OR error if any occurs
 * */
module.exports.createAdmin = admin => {
    return Admin.find({ email: admin.email }).then(data => { // check using email
        if (!data.length) {
            return Admin.create(admin);
        } else {
            return new Promise((resolve, reject) => {
                reject("Admin Duplicated");
            })
        }
    })
};

/**
 * @function findByIdAdmin finds an admin in the database based on his/her object id
 * @param _id {string} object_id as a String
 * @return {Promise<object>} Promise which contain the admin OR error if any occurs
 * */
module.exports.findByIdAdmin = _id => {
    return Admin.findById(_id);
};

/**
 * @function findOneByIdAndRemoveAdmin finds an admin in the database based on his/her object id and removes it
 * @param _id {string} object_id as a String, of the admin instance to be deleted
 * @return {Promise<object>} Promise which contain the removed admin OR error if any occurs
 * */
module.exports.findOneByIdAndRemoveAdmin = _id => {
    return Admin.findByIdAndRemove(_id)
};
/**
 * @function findOneByIdAndUpdateAdmin find one admin by object id and updates it using the @code{criteriaObject} provided
 * @param {string} _id the id of the admin to be updated
 * @param {object} criteriaObject the object which contains the criteria to update that specific  admin instance
 * @return {Promise<object>} Promise which contain the updated admin OR error if any occurs
 * */
module.exports.findOneByIdAndUpdateAdmin = (_id, criteriaObject) => {
    return Admin.findByIdAndUpdate({ _id }, criteriaObject);
};
/**
 * @function findOneAdmin finds a One Admin Only, and return a Promise, with the result in the resolved function of the promise
 * @param criteriaObject The criteria that you want to search with
 * @return Promise<any>, that contain the result in the resolved function, or Error in the reject function
 * */
module.exports.findOneAdmin = criteriaObject => {
    return Admin.findOne(criteriaObject);
};
/**
 * @function findAdmins return all the admins in the database of not given any param, or returns the admin in the database based in the param based into the function
 * @param criteriaObject the object contains the criteria to search with in the database
 * @return Promise<object|Error> return a promise with the resolve value of the search or a error, if any occurred
 * */
module.exports.findAdmins = (criteriaObject = {}) => {
    return Admin.find(criteriaObject);
};
/**
 * @function findOneAndUpdateAdmin find a specie admin using the criteria in the @code{criteriaObject} and updates it using the @code{updateCriteriaObject}
 * @param criteriaObject the object contains the criteria to search with in the database
 * @param updateCriteriaObject the object contains the criteria to update with in the database
 * @return Promise<object|Error> return a promise with the resolve value of the search or a error, if any occurred
 * */
module.exports.findOneAndUpdateAdmin = (criteriaObject, updateCriteriaObject) => {
    return Admin.findOneAndUpdate(criteriaObject, updateCriteriaObject);
};