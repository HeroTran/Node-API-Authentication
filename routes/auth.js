const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifytoken } = require('../utils/verifytoken');
const passport = require('passport');
const userController = require('../utils/authContainer');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { createRespondObjectError, createRespondObjectSuccess } = require('../utils/helpers');
dotenv.config();
//Change evn depend on EVN has set
const evn = app.get('env');
require('custom-env').env(evn);


//login fb
router.get("/facebook", passport.authenticate('facebook', { scope: 'email' }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/' }), function (req, res) {
    res.redirect(`${process.env.REDIRECT_URL}/?codeLogin=` + req.user.codeLogin);
});


router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExit = await User.findOne({ email: req.body.email });
    if (emailExit) return createRespondObjectError(res, 'Email already !');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        password: hashPassword
    });
    try {
        const saveUser = await user.save();
        return createRespondObjectSuccess(res, user);
    } catch (error) {
        return createRespondObjectError(res, error);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return createRespondObjectError(res, 'Email is not found !');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!validPass) return createRespondObjectError(res, 'Invalid Password');

    try {
        var signOptions = {
            algorithm: 'HS256',
            expiresIn: 10000
        };
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, signOptions);
        user.tokens = user.tokens.concat({ token })
        await user.save();
        res.cookie('token', token, { maxAge: 10000 * 1000 })
        res.header('Authorization', token).send({
            "isSuccess": true,
            "token": token,
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
router.post('/findUserByCode', async (req, res) => {
    const user = await User.findOne({ codeLogin: req.body.codeLogin });
    if (!user) return createRespondObjectError(res, 'Code is not found !')
    try {
        res.status(200).send({
            "isSuccess": true,
            'data': user
        });
    } catch (error) {
        res.status(400).send({
            "isSuccess": false,
            'error': error
        });
    }
});

router.post('/findUserByToken', async (req, res) => {
    let decoded;
    const authorization = req.header('Authorization');
    try {
        decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    console.log('dasdasdas');
    User.findOne({ _id: decoded._id }).then(function (user) {
        console.log(user);
        return createRespondObjectSuccess(res, user);
    });
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