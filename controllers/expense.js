const User = require("../models/user");

exports.getPage = (req, res, next) => {
  const userData = {};
  res.render('login', {
    userData: userData
  });
};

exports.postUserSignup = (req, res, next) => {
  const name = req.body.name1;
  const email = req.body.email1;
  const password = req.body.password;
  let userIsFound = false;
  const userData = {};
  User.findAll({ where: { email: email}})
  .then((users) => {
    console.log(users);
    userIsFound = true;
    return users[0];
  })
  .then((user) =>{
    if(!userIsFound){
      User.create({
        name: name, 
        email: email, 
        password: password,
      })
      .then((result) => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
    } else {
      userData.error= 'User Already exists';
      res.render('login', {
        userData: userData
      });
    }
  })
  .catch(err => console.log(err));  
};
