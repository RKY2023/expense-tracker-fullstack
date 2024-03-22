const path = require("path");
require('dotenv').config();

var cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");


app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/user',userRoutes);
app.use('/api',apiRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use('/premium',premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize
  // .sync({ force: true})
  .sync()
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));