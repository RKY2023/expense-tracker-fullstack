const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
  res.render("login", {
    mode: 'login',
    error: [],
  });
};

const signup = (req, res, next) => {
    res.render("login", {
      mode: 'signup',
      error: [],
    });
  };

const validateString = (string) => {
  if (string.length > 6) return true;
};

const generateAccessToken = (user) => {
  // console.log('tokenize', user);
  return jwt.sign(user, process.env.TOKEN_KEY);
}

const authenticate = async (req, res, next) => {
  // console.log('rt')
  try {
      const token = req.header('Authorization');
      console.log(token);
      const userData = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findByPk(userData.userId);
      // console.log(token);
      req.user = user;
      next();
  } catch(err) {
    console.log(err);
    return res.status(401).json({error: { message: 'auth failed'}});
  }
}

const signupAPI = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  bcrypt.hash(password, 10, async (err, result) => {
    await User.create({ name, email, password: result })
    .then((user) => {
      const token = generateAccessToken({userId: user.id, username: user.name, isPremium: user.ispremiumuser});
      res.status(203).json({ user: user, token: token });
    })
    .catch((err) => {
      if (err.errors) {
        if ((err.errors.message = "email must be unique")) {
          res.status(201).json({ error: { message: "Email already exists." } });
        }
      } else {
        res.status(404).json(err);
      }
    });
  })
  
};

const loginAPI = (req, res, next) => {
    const { email, password } = req.body;
    console.log( email, password);
    User.findAll({ where: { email: email } })
      .then((users) => {
        const user = users[0];
        if(users.length == 0){
            res.status(200).json({ error: { message: 'User doesn\'t exist'}});
        } else if(user.password != password) {
            bcrypt.compare(password, user.password, (err, matched) => {
              console.log(password, user.password, matched);
                if( matched ===  true) {
                  user.password = '';
                  const token = generateAccessToken({userId: user.id, username: user.name, isPremium: user.ispremiumuser});
                  res.status(203).json({ user: user, token: token });                    
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
  loginAPI: loginAPI,
  authenticate: authenticate,
  generateAccessToken,
};
