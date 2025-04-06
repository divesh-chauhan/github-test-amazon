const router = require('express').Router();
const jwtAuth = require('../auth/jwtAuth');
const { placeOrder } = require('../controllers/orderController');

router.post('/place', jwtAuth, placeOrder);


module.exports = router;