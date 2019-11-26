const jwt = require('jsonwebtoken');
const User = require('../model/User');

async function verifytoken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied !');
    try {
        const verifytoken = jwt.verify(token, process.env.TOKEN_SECRET);
        const user  = await User.findOne({ _id:verifytoken._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

module.exports.verifytoken = verifytoken;