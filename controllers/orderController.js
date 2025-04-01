const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');


// @des Place Order
// @route POST/order/place

const placeOrder = async (req, res) => {
    try {
        const { userId, subtotal, tax, shipping, totalPrice } = req.body;
        const cart = await Cart.findOne(userId).populate('products.productId');

        if (!cart){
            return res.status(400).json({error:'Cart Not Found ❌'});
        }

        const productWithSubTotal = cart.products.map(product => ({
            productId : product.productId._id,
            quantity : product.quantity,
            subTotal : product.productId.price * product.quantity
        }));

        const order = await new Order({
            userId,
            products : productWithSubTotal,
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
        console.log(error);
        res.status(5000).json({error:'failed to place order ❌'});
    }
};


module.exports = {
    placeOrder
}