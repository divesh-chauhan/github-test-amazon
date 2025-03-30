const router = require('express').Router();
const jwtAuth = require('../auth/jwtAuth');
const { register, login, profile, logout } = require('../controllers/userController');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', register);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', login);

router.get('/profile', jwtAuth, profile);

router.post('/logout', logout)

module.exports = router

