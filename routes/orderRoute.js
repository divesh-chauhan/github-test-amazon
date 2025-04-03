const router = require('express').Router();
const jwtAuth = require('../auth/jwtAuth');
const { placeOrder, showOrder, removeOrder } = require('../controllers/orderController');

router.post('/place', jwtAuth, placeOrder);
router.get('/show', jwtAuth, showOrder);
router.post('/remove', jwtAuth, removeOrder);


module.exports = router;