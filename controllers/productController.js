const Product = require('../models/productModel');

// @des Add Products
// @route POST/product/add
const addProducts = async (req, res) => {
    try {
        const {name, price, shortDescription, longDescription, category, stock} = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const products = await new Product({
            name,
            price,
            shortDescription,
            longDescription,
            image,
            category,
            stock
        });

        await products.save();
        res.redirect('/product/show');
    } catch (error) {
        console.log(error);
        res.status(400).json({error:'failed to Add Product ❌'});
    }
};


// @des Show Products
// @route GET/product/show
const showProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if(! products) {
            return res.status(400).json({ error : 'Product was Empty ⚠' });
        }
        res.render('products', { products });
    } catch (error) {
        console.log(error);
        res.status(400).json({error:'failed to Show All Products ❌'});
    }
};


module.exports = {
    addProducts,
    showProducts
}