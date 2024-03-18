const User = require("../models/user");

exports.getPage = (req, res, next) => {
  res.render('login', {
    blogs: [],
  });
};

exports.postLogin = (req, res, next) => {
  const name = req.body.name1;
  const email = req.body.email1;
  const password = req.body.password;
  User.create({
    name: name, 
    email: email, 
    password: password,
  })
  .then((result) => {
    res.redirect('/');
  })
  .catch(err => console.log(err));
};
