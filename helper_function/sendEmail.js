const nodemailer = require('nodemailer');

/**
 * @async
 * @function sendMail used to send an email to a specific user
 * @param email {string} the email of the receiver
 * @param subject {string} the subject of the email to be sent
 * @param template {string} the template of the message, needs to be in HTML format
 * */
exports.sendMail = async (email,subject,template) => {
    try{
        if(!_validateEmail(email)){
            throw new Error("Incorrect Email");
        }
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
            tls:{
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: "",
            html: template
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }catch (e) {
        console.warn(e)
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