const path = require("path");

var cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use('/user',userRoutes);
app.use('/api',apiRoutes);
app.use(expenseRoutes);

// Blog.hasMany(Comment);

sequelize
  // .sync({ force: true})
  .sync()
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));