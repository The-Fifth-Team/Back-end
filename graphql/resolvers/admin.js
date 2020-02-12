const AdminFunctions = require('../../Models/Admin');
const sendEmail = require('../../helper_function/sendEmail');
const bcrypt = require('bcryptjs');
module.exports = {
    Mutation: {
        /**
         * @function forgetPassword used to send a password reset token to the user's email, in order to reset his password with it
         * @param {object} parent pointer which points to the parent function, in the query Or mutation order, which called this function (IF EXISTS)
         * @param {string} email of the user that forgets his/her password
         * @return {Promise<string|Error>} return a message donating the success of sending the email OR Error of happened
         * @since 1.0.0
         * @version 1.0.0
         */
        async forgetPassword(parent, { email }) {
            const admin = await AdminFunctions.findOneAdmin({ email });
            if (!admin) {
                return new Error("there is no admin with that email");
            }

            const resetToken = admin.createPasswordResetToken();
            await admin.save({ validateBeforeSave: false });
            const url = `frontend/verify/${resetToken}`;//needs updating when testing from the front end
            return sendEmail("any@gmail.com", "Password Reset Email", url);
        },
        /**
         * @function checkToken checks the password reset token, sent back by the user, when he clicked the link in his email, and checks if it's still valid and not expired
         * @param {object} parent pointer which points to the parent function, in the query Or mutation order, which called this function (IF EXISTS)
         * @param {string} token the token sent back from the user, when he/she clicked the url provided
         * @return {string|Error} hashedToken return the hashed Token to be checked in the next step of the process
         * @since 1.0.0
         * @version 1.0.0
         */
        async checkToken(parent, { token }) {
            if (token) {
                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                const admin = await AdminFunctions.findOneAdmin({
                    passwordResetToken: hashedToken,
                    passwordResetTokenExpired: { $gt: Date.now() }
                });
                if (!admin) {
                    return new Error("Token is invalid or Expired");
                }

                return hashedToken;
            } else {
                return new Error("No Token is provided")
            }
        },
        /**
         * @function resetPassword this function checks the hashed Token and of it's still valid, it well accept the new password, hash it and save it in the database
         * @param {object} parent pointer which points to the parent function, in the query Or mutation order, which called this function (IF EXISTS)
         * @param {string} token the hashed token that well be received from the previous step
         * @param {string} password the new Password that well be saved for this specific admin
         * @return token {string|Error} of no error happens, returns a new sign in Token
         * @since 1.0.0
         * @version 1.0.0
         */
        async resetPassword(parent, { token, password }) {
            const admin = await AdminFunctions.findOneAdmin({
                passwordResetToken: token,
                passwordResetTokenExpired: { $gt: Date.now() }
            });
            if (!admin) {
                return new Error("Something wrong Happened");
            }
            password = await bcrypt.hash(password, 8);
            admin.password = password;
            admin.passwordResetTokenExpired = undefined;
            admin.passwordResetToken = undefined;
            await admin.save();
            //should assign new sign in token and return it to the front end //
        }
    }
};