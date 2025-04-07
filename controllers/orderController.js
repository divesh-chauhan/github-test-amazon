const mongoose = require('mongoose');
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


// @des Remove Order
// @route POST/order/remove

const removeOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.body;
        const objectId = new mongoose.Types.ObjectId(productId);

        let order = await Order.findByIdAndUpdate(orderId,
            {$pull : { products : { productId : objectId }}},
            { new : true }
        );

        if(!order){
            return res.status(400).json({error:'order was not removed ❌'});
        }

        order = await Order.findById(orderId).populate('products.productId');

        if(!order.products.length){
            await Order.findByIdAndUpdate(orderId,
                {
                    subtotal : 0,
                    tax : 0,
                    shipping : 0,
                    totalPrice : 0
                },
                { new : true }
            );
        } else {
            let newSubtotal = order.products.reduce((acc, product) => acc + product.productId.price * product.quantity,0);
            let newTax = newSubtotal * 0.1;
            let newShipping = newSubtotal > 1000 ? 0 : 100;
            let newPrice = newSubtotal + newTax + newShipping;
            
            await Order.findByIdAndUpdate(orderId , 
                {
                    subtotal : newSubtotal,
                    tax : newTax,
                    shipping : newShipping,
                    price : newPrice
                },
                { new : true }
            );
            
            res.set('Cache-Control','no-store');
            res.redirect('/order/show');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to remove order ❌'});
    }
};


module.exports = {
    placeOrder,
    showOrder,
    removeOrder
}