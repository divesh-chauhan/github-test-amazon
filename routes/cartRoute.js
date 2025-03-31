const router = require('express').Router();
const jwtAuth = require('../auth/jwtAuth');

const { addToCart, showCart, removeCart, checkout } = require('../controllers/cartController');

router.post('/add', jwtAuth, addToCart);
router.get('/show', jwtAuth, showCart);
router.post('/remove', jwtAuth, removeCart);
router.get('/checkout', jwtAuth, checkout);

module.exports = router;