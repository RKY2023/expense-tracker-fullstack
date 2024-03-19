const User = require("../models/user");

const getPage = (req, res, next) => {
  const userData = {};
  res.render("login", {
    userData: userData,
    mode: 'signup',
    
  });
};

const postUserSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let userIsFound = false;
  const userData = {};
  User.findAll({ where: { email: email } })
    .then((users) => {
      console.log(users);
      userIsFound = true;
      return users[0];
    })
    .then((user) => {
      if (!userIsFound) {
        User.create({
          name: name,
          email: email,
          password: password,
        })
          .then((result) => {
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      } else {
        userData.error = "User Already exists";
        res.render("login", {
          userData: userData,
        });
      }
    })
    .catch((err) => console.log(err));
};

const postTest = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let userData = {};
  User.findAll({ where: { email: email } })
    .then((users) => {
      // res.status(203).json(users);
      if (users.length > 0) {
        userData.users = users[0];
        userData.error = "User Already exists";
      } else if (!userIsFound) {
        User.create({ name: name, email: email, password: password })
          .then((result) => {
            console.log("user created");
            userData.users = result;
          })
          .catch((err) => console.log(err));
      }
    })
    .then((user) => {
      res.status(203).json(userData);
    })
    .then(() => {
      return userData;
    })
    .catch((err) => console.log(err));
};

const validateString = (string) => {
  if (string.length > 6) return true;
};

const newSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  User.create({ name, email, password })
    .then(() => {
      res.status(203).json({ message: "User created successfully" });
    })
    .catch((err) => {
      if (err.errors) {
        if ((err.errors.message = "email must be unique")) {
          res.status(404).json({ error: { message: "Email already exists." } });
        }
      } else {
        res.status(404).json(err);
      }
    });
};

module.exports = {
  getPage: getPage,
  postUserSignup: postUserSignup,
  postTest: postTest,
  newSignup: newSignup,
};
