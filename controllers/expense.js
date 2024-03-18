const User = require("../models/user");

exports.getPage = (req, res, next) => {
  const userData = {};
  res.render('login', {
    userData: userData
  });
};

exports.postUserSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
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


exports.postTest = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let userData = {};
  User.findAll({ where: { email: email}})
  .then((users) => {
    // res.status(203).json(users);
    if(users.length > 0) {
      userData.users = users[0];
      userData.error= 'User Already exists';

    } else if (!userIsFound) {
      User.create({ name: name, email: email, password: password })
      .then((result) => {
        console.log('user created');
        userData.users = result;
      })
      .catch(err => console.log(err));
    } 
  })
  .then((user) => {
    res.status(203).json(userData);
  })
  .then(() => {
    return userData;
  })
  .catch(err => console.log(err)); 
  
}