const router = require('express').Router();
const upload = require('../media/fileUpload');
const { addProducts, showProducts, showProductDetails } = require('../controllers/productController');

router.get('/add', (req, res) => res.render('addProducts'));
router.post('/add', upload.single('image'), addProducts);
router.get('/show', showProducts);
router.get('/details/:productId', showProductDetails);


module.exports = router;