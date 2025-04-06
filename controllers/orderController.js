const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');


// @des Place Order
// @route POST/order/place

const placeOrder = async (req, res) => {
    try {
       const { userId, subtotal, tax, shipping, totalPrice } = req.body;
       const cart = await Cart.findOne({userId}).populate('products.productId');

       if(!cart){
          return res.status(400).json({error:'cart was not found ❌'});
       }

       let productWithSubtotal = cart.products.map(product => ({
            productId : product.productId._id,
            quantity : product.quantity,
            subTotal : product.productId.price * product.quantity
       }));

       const order = await new Order({
            userId,
            products : productWithSubtotal,
            subtotal,
            tax,
            shipping,
            totalPrice,
            status : 'Pending'
       });

       await order.save();
       await Cart.findOneAndDelete({ userId });

       res.redirect('/order/show');
    } catch (error) {
        console.log(500).json({error:'failed to place order ❌'});
    }
};


// @des Show Order
// @route GET/order/show

const showOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const order = await Order.findOne({ userId }).populate('products.productId');

        if(! order){
            return res.status(400).json({error:'order not found ❌'});
        }

        res.render('order', { order });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to show order ❌'});
    }
};


module.exports = {
    placeOrder,
    showOrder
}