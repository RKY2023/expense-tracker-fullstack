const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequests = require("../models/forgotPassword");
const User = require("../models/user");
const userController = require('./user');

const forgotPassword = (req, res, next) => {
    res.render("login", {
        mode: 'forgotpassword',
        error: [],
      });
}

const forgotPasswordMail = async (req, res, next) => {
    console.log('forgotPasswordMail', req.body, req.params);
    const uuid = uuidv4();
    console.log(req.user);
    const fpm = await req.user.createForgotpasswordrequests({id: uuid, isactive: true});
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
    console.log('resetpassword', req.body, req.params);
    // resetId
    const resetId = req.params.resetId;
    const fpr = ForgotPasswordRequests.findAll({ where: { id: resetId, isactive: true }});
    const user = User.findByPk(fpr.userId);
    console.log(fpr, user);
    res.render("login", {
        mode: 'resetpassword',
        token: user,
        error: [],
    });
}

const updatePassword = async (req, res, next) => {
    console.log('resetpassword', req.body, req.params);
    // resetId
    const resetId = req.params.resetId;
    const user = req.user.update({ password: newpassword });
    console.log(fpr);
    res.status(200).json({ success : { message: 'Your password has been updated.' }});
}

module.exports = {
    forgotPassword,
    forgotPasswordMail,
    resetPassword, 
}