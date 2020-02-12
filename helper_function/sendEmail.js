const nodemailer = require('nodemailer');

/**
 * @async
 * @function sendMail used to send an email to a specific user
 * @param {string} email -  the email of the receiver
 * @param {string} subject -  the subject of the email to be sent
 * @param {string} text - if you dont want to send HTML template you can just send a plain text
 * @param {string} template -  the template of the message, needs to be in HTML format
 * */
exports.sendMail = async(email, subject, text,template = "") => {
    try {
        if (!_validateEmail(email)) {
            throw new Error("Incorrect Email");
        }
        let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 25,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({

            from: "The FIFTH GROUP <test@test.com>",
            to: email,
            subject: subject,
            text: text,
            html: template
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return `Message send successfully: %s ${info.messageId} \nto ${email}`;
    } catch (e) {
        console.warn(e);
        return e.toString();
    }
};

/**
 * @function _validateEmail used to validate the email address provided
 * @param email {string}  the email to be checked
 * @return {boolean} true if the email is valid false of not
 * @private Not to be used outside the scope of this file
 * */
const _validateEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};