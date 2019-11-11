const jwt = require('jsonwebtoken');

function verifytoken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied !');
    try {
        const verifytoken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = {
            'userID':verifytoken
        };
        console.log(req.user);
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

module.exports.verifytoken = verifytoken;