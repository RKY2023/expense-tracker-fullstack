const Razorpay = require('razorpay');
const Order = require("../models/order");


const purchasePremium = (req, res, next) => {
    // console.log('tt');
    // console.log(process.env.RAZORPAY_KEY_ID);
    try{
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 3550; // in paise 3550 = 35.50

        rzp.orders.create({ amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            })
            
        })
    } catch(err) {
        console.log(err);
        res.status(401).json({ message: 'something wen wrong' ,error : err});
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id }});
        const p1 = await order.update({ paymentid: payment_id, status: 'SUCCESSFUL'});
        const p2 = await req.user.update({ ispremiumuser: true});
        return res.status(202).json({ success: true, message: "Transaction success"});

    } catch (err) {
        throw new Error(err);
    }
}
module.exports = {
    purchasePremium: purchasePremium,
    updateTransaction: updateTransaction
};