const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_KEY = process.env.ACCESS_KEY;
const TOKEN_EXPIRES_TIME = process.env.TOKEN_EXPIRES_TIME;

// @des Register
// @route POST/user/auth/register
const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({error:'User Already Exists ! try with another email.'});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const registeredUser = await new User({
            username,
            email,
            password : hashedPassword
        });

        await registeredUser.save();
        res.redirect('/user/auth/login');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Registration failed ❌'});
    }
};


// @des Login
// @route POST/user/auth/login
const login = async (req, res) => {
    try {
        const {email, password, rememberMe} = req.body;
        const user = await User.findOne({email});

        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({error:'Invalid email or password ⚠'});
        }

        const expiresIn = rememberMe ? '7d' : TOKEN_EXPIRES_TIME;

        const cookieOptions = {
            httpOnly : true,
            secure : false,
            maxAge : rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
        }

        const token = await jwt.sign({ userId : user._id, username:user.username }, ACCESS_KEY, { expiresIn });
        res.cookie('jwt', token, cookieOptions);
        res.redirect('/user/auth/profile');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Login failed ❌'});
    }
};


// @des Profile
// @route GET/user/auth/profile
const profile = async (req, res) => {
    try {
       const username = req.user.username;
       res.render('profile', { username });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to Access Profile ❌'});
    }
};

// @des Logout
// @route POST/user/auth/logout
const logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.redirect('/user/auth/login');
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'failed to Logout ❌'});
    }
};



module.exports = {
    register,
    login,
    profile,
    logout
}