const AdminFunctions = require('../../Models/Admin');
const sendEmail = require('../../helper_function/sendEmail');
const bcrypt = require('bcryptjs');
module.exports = {
    Mutation: {
        async forgetPassword(parent, { email }) {
            const admin = await AdminFunctions.findOneAdmin({ email });
            if (!admin) {
                return new Error("there is no admin with that email");
            }

            const resetToken = admin.createPasswordResetToken();
            await admin.save({ validateBeforeSave: false });
            const url = `frontend/verify/${resetToken}`;//needs updating when testing from the front end
            return await sendEmail("any@gmail.com", "Password Reset Email", url);
        },
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
        async resetPassword(parent, { token, password }) {
            const admin = await AdminFunctions.findOneAdmin({
                passwordResetToken: token,
                passwordResetTokenExpired: { $gt: Date.now() }
            });
            if (!admin) {
                return new Error("Something wrong Happened");
            }
            admin.password = password;
            admin.passwordResetTokenExpired = undefined;
            admin.passwordResetToken = undefined;
            await admin.save();
        }
    }
};