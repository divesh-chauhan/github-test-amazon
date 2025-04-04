const router = require('express').Router();
const jwtAuth = require('../auth/jwtAuth');
const { placeOrder, showOrder} = require('../controllers/orderController');

router.post('/place', jwtAuth, placeOrder);
router.get('/show', jwtAuth, showOrder);


module.exports = router;