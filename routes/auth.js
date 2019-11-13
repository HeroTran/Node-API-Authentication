const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../helper/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        res.status(201).send({
            "status": true,
            "id": user._id,
            "data": user
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

//LOGIN
router.post('/login', async (req, res, next) => {
    debugger;
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found !');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Password')
    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('Authorization', token).send({
            "status": true,
            "token": token
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/list', function (req, res) {
    User.find({}).then(function (users) {
        res.send(users);
    });
});

module.exports = router;