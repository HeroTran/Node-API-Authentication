const router = require('express').Router();
const { verifytoken } = require('../helper/verifytoken');


router.get('/', verifytoken, (req, res) => {
    res.status(200).send(req.user.userID._id);
});


module.exports = router;