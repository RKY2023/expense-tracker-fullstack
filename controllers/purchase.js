const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");
const userController = require("./user");

const purchasePremium = (req, res, next) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 3550; // in paise 3550 = 35.50

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log(err);
        // throw new Error(JSON.stringify(err));
      }

        Order.create({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "something wen wrong", error: err });
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id });
    const p1 = await new Promise((resolve, reject) => {
      order.paymentid = payment_id;
      order.status = "SUCCESSFUL";
      order.save();
      resolve();
    })
    const p2 = await new Promise(async (resolve, reject) => {
      // console.log( req.user.userId)
      const user = await User.findOne({ _id: req.user._id});
      // console.log('ttt', user);
      user.ispremiumuser = true ;
      user.save();
      resolve();
    })


    Promise.all([p1, p2])
      // .then(() => {
      //   // console.log(req.user);
      //   console.log(User.findOne({ _id: req.user.userId}))
      // })
      .then(() => {
        return res
          .status(202)
          .json({
            success: true,
            message: "Transaction success",
            token: userController.generateAccessToken({
              userId: req.user.id,
              username: req.user.name,
              isPremium: req.user.ispremiumuser,
            }),
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
module.exports = {
  purchasePremium: purchasePremium,
  updateTransaction: updateTransaction,
};
