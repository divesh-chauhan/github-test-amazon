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



// @des Payment
// @route POST/payment/pay

const payment = async (req,res) => {
    try {
        const { orderId, userId, paidAmount, paymentMethod, transactionId } = req.body;
        const order = await Order.findById(orderId);

        if(!order){
            return res.status(400).json({error:'order was not found ❌'});
        }

        const payment = await new Payment({
            userId,
            orderId,
            paidAmount,
            paymentMethod,
            transactionId,
            status : 'Completed'
        });

        await payment.save();
        order.status = 'Paid';
        await order.save();

        res.redirect('/payment/details');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'payment failed ❌'});
    }
};


// @des Payment Details
// @route GET/payment/details

const showPaymentDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const payment = await Payment.findOne(orderId).populate('orderId');

        if(!payment){
            return res.status(400).json({error:'payment not found ❌'});
        }

        res.render('paymentDetails', { payment });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to show payment details ❌'});
    }
};


module.exports = {
    showPaymentPage,
    payment,
    showPaymentDetails 
}