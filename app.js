const path = require("path");
require("dotenv").config();
const fs = require("fs");
// const https = require("https");

var cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const helmet = require("helmet");
// const compression = require("compression");
// const morgan = require("morgan");
// const helmet = require('compression');


// const sequelize = require("./util/database");
// const User = require("./models/user");
// const Expense = require("./models/expense");
// const Order = require("./models/order");
// const forgotPasswordRequests = require("./models/forgotPassword");
// const Transaction = require("./models/transaction");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
// const passwordRoutes = require("./routes/password");

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
app.use(cors());
// app.use(helmet());
// app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/api", apiRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use("/premium", premiumRoutes);
// app.use("/password", passwordRoutes);

mongoose
.connect(process.env.MONGODB_URL)
.then((result) => {
  // User.findOne().then( user => {
  //   if(!user) {
  //     const user = new User({
  //       name: 'Raj',
  //       email: 'Raj@test.com',
  //       cart: {
  //         items: []
  //       }
  //     });
  //     user.save();
  //   }
  // })
  // console.log('COnnected');
  app.listen(process.env.PORT || 3000);
})
.catch((err)=>{
  console.log(err);
})
