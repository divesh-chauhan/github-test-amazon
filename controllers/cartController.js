const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');


// @des Add to Cart
// @route POST/cart/add

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        const product = await Product.findById(productId);

        if (!product){
            return res.status(400).json({error:'Product Not Found ❌'});
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products:[] });
        }

        let isCartExists = cart.products.find(product => product.productId.equals(productId));

        if (isCartExists) {
            isCartExists.quantity += 1;
        } else {
            cart.products.push({ productId, quantity : 1 });
        }

        await cart.save();
        res.redirect('/cart/show');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to add product into cart ❌'});
    }
};


// @des Show Cart
// @route GET/cart/show

const showCart = async (req, res) => {
    try {
       const userId = req.user.userId;
       const cart = await Cart.findOne({ userId }).populate('products.productId');

       if(!cart){
          return res.status(400).json({error : 'Product Not Found ❌'});
       }

       res.render('cart', { cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to show cart ❌'});
    }
};


// @des Remove Cart
// @route POST/cart/remove

const removeCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;
        
        const objectId = new mongoose.Types.ObjectId(productId);

        const cart = await Cart.findOneAndUpdate({ userId },
            { $pull : { products : { productId : objectId }}},
            { new : true }
        );

        if (!cart) {
            return res.status(400).json({error:'Item was not removed ❌'});
        }

        res.redirect('/cart/show');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to remove item from cart ❌'});
    }
};


// @des Checkout Page
// @route POST/cart/checkout

const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart) {
            return res.status(400).json({error:'Cart Not Found ❌'});
        }

        let subtotal = cart.products.reduce((acc, product) => acc + product.productId.price * product.quantity, 0);
        let tax = subtotal * 0.1;
        let shipping = subtotal > 1000 ? 0 : 100
        let totalPrice = subtotal + tax + shipping;

        res.render('checkout', { cart : cart.products, userId, subtotal, tax, shipping, totalPrice });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to show checkout page ❌'});
    }
};


module.exports = {
    addToCart,
    showCart,
    removeCart,
    checkout
}