const router = require('express').Router();
const upload = require('../media/fileUpload');
const { addProducts, showProducts } = require('../controllers/productController');

router.get('/add', (req, res) => res.render('addProducts'));
router.post('/add', upload.single('image'), addProducts);
router.get('/show', showProducts);


module.exports = router;