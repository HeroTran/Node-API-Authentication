const router = require('express').Router();
const { verifytoken } = require('../helper/verifytoken');
const Post = require('../model/Post');


router.get('/', verifytoken, (req, res) => {
    res.status(200).send(req.user.userID._id);
});

router.post('/new', verifytoken, async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        decription: req.body.decription
    });
    try {
        const savePost = await newPost.save();
        res.status(201).send({
            "status": true,
            "id": newPost._id,
            "data": newPost
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;