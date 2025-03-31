require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connect_DB = require('./config/connect_DB');

const app = express();
connect_DB();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));
app.use(morgan('dev'))

app.use(session({
    secret : process.env.SESSION_KEY,
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        secure : false,
        maxAge : 5 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const cartRouter = require('./routes/cartRoute');

app.use('/product', productRouter);
app.use('/user/auth', userRouter);
app.use('/cart', cartRouter);
app.use('/', (req, res) => res.render('index'));



module.exports = app