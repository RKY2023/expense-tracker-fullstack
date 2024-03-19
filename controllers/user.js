const User = require("../models/user");
const bcrypt = require("bcrypt");
const login = (req, res, next) => {
  const userData = {};
  res.render("login", {
    userData: userData,
    mode: 'login',
  });
};

const signup = (req, res, next) => {
    const userData = {};
    res.render("login", {
      userData: userData,
      mode: 'signup',
    });
  };

const validateString = (string) => {
  if (string.length > 6) return true;
};

const signupAPI = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  bcrypt.hash(password, 10, async (err, result) => {
    await User.create({ name, email, password: result })
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
  })
  
};

const loginAPI = (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    User.findAll({ where: { email: email } })
      .then((users) => {
        const user = users[0];
        // console.log(user.password, password, user.password == password)
        if(users.length == 0){
            res.status(404).json({ error: { message: 'User doesn\'t exist'}});
        } else if(user.password != password) {
            bcrypt.compare(password, user.password, (err, matched) => {
                if( matched ===  true) {
                    res.status(203).json({ user: user});
                } else {
                    res.status(401).json({ error: { message: 'Invalid Password'}});        
                }
            })
        } else {
            res.status(404).json(users);
        } 
      })
      .catch((err) => {
        if (err.errors) {
            res.status(500).json({ error: { message: 'server error'}});
        } else {
          res.status(500).json(err);
        }
      });
  };

module.exports = {
  signup: signup,
  login: login,
  signupAPI: signupAPI,
  loginAPI: loginAPI
};
