const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');


// @des Show Payment Page
// @route GET/payment

const showPaymentPage = async (req, res) => {
    try {
       const orderId = req.params.orderId;
       const order = await Order.findById(orderId);
       
       if(!order){
          return res.status(400).json({error:'order was not found ❌'});
       }

       res.render('payment', { order });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to show payment page ❌'});
    }
};



module.exports = {
    showPaymentPage
}