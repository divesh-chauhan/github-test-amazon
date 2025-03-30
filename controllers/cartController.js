const Product = require('../models/productModel');
const Cart = require('../models/cartModel');


// @des Add to Cart
// @route POST/cart/add

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        const product = await Product.findById({ productId });

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

module.exports = {
    addToCart,
    showCart
}