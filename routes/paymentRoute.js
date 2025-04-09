const router = require('express').Router();
const {  showPaymentPage, payment, showPaymentDetails } = require('../controllers/paymentController');

router.get('/:orderId', showPaymentPage);
router.post('/pay', payment);
router.get('/details/:orderId', showPaymentDetails);


module.exports = router;