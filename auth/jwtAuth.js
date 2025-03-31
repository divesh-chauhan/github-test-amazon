const jwt = require('jsonwebtoken');
const ACCESS_KEY = process.env.ACCESS_KEY;

const jwtAuth = async (req,res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(400).json({error:'Invalid or expired token ⚠'});
    }

    try {
       const decoded = jwt.verify(token, ACCESS_KEY);
       req.user = decoded;
       next();
    } catch (error) {
       console.log(error);
       res.status(500).json({error:'Unauthorized user ❌'});
    }
};

module.exports = jwtAuth;