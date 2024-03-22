const Sib = require('sib-api-v3-sdk');

const forgotPassword = (req, res, next) => {
    res.render("login", {
        mode: 'forgotpassword',
        error: [],
      });
}

const forgotPasswordMail = async (req, res, next) => {
    console.log('forgotPasswordMail', req.body);
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
    const mailStatus = await transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Expense Tracker - Password reset mail',
        textContent: `New Test`,
    });
    console.log(mailStatus);
}

module.exports = {
    forgotPassword,
    forgotPasswordMail
}