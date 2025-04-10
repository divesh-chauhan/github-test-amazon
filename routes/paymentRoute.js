const router = require('express').Router();
const {  showPaymentPage, payment, showPaymentDetails } = require('../controllers/paymentController');

router.get('/details/:orderId', showPaymentDetails);
router.get('/:orderId', showPaymentPage);
router.post('/pay', payment);


module.exports = router;