const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifytoken } = require('../utils/verifytoken');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExit = await User.findOne({ email: req.body.email });
    if (emailExit) return res.status(400).send('Email already !');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const saveUser = await user.save();
        res.status(200).send({
            "isSuccess": true,
            "data": user
        })
    } catch (error) {
        res.status(400).send({
            "isSuccess": false,
            'error': error
        });
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found !');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password')

    try {
        var signOptions = {
            algorithm: 'HS256',
            expiresIn: 10000 // token 30second
        };
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, signOptions);
        console.log('token:', token)
        user.tokens = user.tokens.concat({ token })
        await user.save();
        res.cookie('token', token, { maxAge: 10000 * 1000 })
        res.header('Authorization', token).send({
            "isSuccess": true,
            "token": token
        })
    } catch (error) {
        res.status(400).send({
            "isSuccess": false,
            'error': error
        });
    }
});

router.post('/logout', verifytoken, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send({
            "isSuccess": true,
            'token': null
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/logoutall', verifytoken, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({
            "isSuccess": true,
            'token': null
        })
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router;