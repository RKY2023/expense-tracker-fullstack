const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

const ForgotPasswordRequests = require("../models/forgotPassword");
const User = require("../models/user");

const forgotPassword = (req, res, next) => {
    res.render("login", {
        mode: 'forgotpassword',
        error: [],
      });
}

const forgotPasswordMail = async (req, res, next) => {
    console.log('forgotPasswordMail', req.body, req.params);
    const uuid = uuidv4();
    console.log(User);
    console.log(req.user);
    const fpm = await req.user.createForgotpasswordrequest({id: uuid, isactive: true});
    console.log(fpm)

    const defaultClient = Sib.ApiClient.instance;
    // Instantiate the client 
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: 'Expense-tracker@gmail.com',
    }
    const receivers = [
        {
            email: req.body.email,
        },
    ]
    const textContent = `<html>
    <body>
    <h1>Forgot Password Link</h1>
    <br/>
    <a href="http://localhost:3000/password/resetpassword/${uuid}">reset password link</a>
    </body>
    </html>`;
    const mailStatus = await transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Expense Tracker - Password reset mail',
        textContent: textContent,
    });
    console.log(mailStatus);
}

const resetPassword = async (req, res, next) => {
    res.render("login", {
        mode: 'resetpassword',
        error: [],
    });
}

const updatePassword = async (req, res, next) => {
    const newpassword = req.body.password;
    const resetId = req.body.resetId;
    try {
        const fpr = await ForgotPasswordRequests.findAll({ where: { id: resetId, isactive: true }});
        const fpr2 = await fpr[0].update({ isactive: false });
        const user = await User.findAll({ where: { id: fpr[0].userId } });
        let passwordupdated;
        bcrypt.hash(newpassword, 10, async (err, result) => {
            passwordupdated = await user[0].update({ password: result });
        })
        res.status(200).json({ success : { message: 'Your password has been updated.' }});
    } catch (err) {
        console.log(err);
        res.status(200).json({ error : { message: 'Something went wrong' }});
    }
    
    
}

module.exports = {
    forgotPassword,
    forgotPasswordMail,
    resetPassword, 
    updatePassword
}