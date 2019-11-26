const router = require('express').Router();
const { verifytoken } = require('../utils/verifytoken');
const { createObjectPagination, createRespondObjectError, createRespondObjectSuccess } = require('../utils/helpers');
const Post = require('../model/Post');
const User = require('../model/User');

/**get all post have pagination */
router.get("/", verifytoken, async (req, res) => {
    try {
        var pageNumber = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 10;
        var query = { "deleted": 0 };
        Post.find(query)
            .sort({ postId: -1 })
            .skip(pageNumber * limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return createRespondObjectError(res, err);
                }
                Post.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    return createObjectPagination(res, count, pageNumber, doc.length, doc);
                });
            });
    } catch (error) {
        return createRespondObjectError(res, error);
    }
});

/**get post detail */
router.get('/:postId', verifytoken, async (req, res) => {
    try {
        const postId = req.params.postId;
        var query = { deleted: 0, postId: postId };
        const postDetail = await Post.findOne(query);
        return createRespondObjectSuccess(res, postDetail);
    } catch (error) {
        return createRespondObjectError(res, error);
    }
});

/**add new post */
router.post('/', verifytoken, async (req, res) => {
    try {
        var query = { deleted: 0, _id: req.user.userID._id };
        const user = await User.findOne(query);
        if (!user) return res.status(400).send('User not exites !');
        const newPost = new Post({
            title: req.body.title,
            decription: req.body.decription,
            createdBy: user.userId
        });
        const savePost = await newPost.save();
        return createRespondObjectSuccess(res, savePost);
    } catch (error) {
        return createRespondObjectError(res, error);
    }
});

/**update post */
router.put('/:postId', verifytoken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const updatePostInfo = {
            $set: {
                title: req.body.title,
                decription: req.body.decription,
            }
        };
        var query = { postId: postId, deleted: 0 };
        const updatePost = await Post.findOneAndUpdate(query, updatePostInfo, { new: true });
        return createRespondObjectSuccess(res, updatePost);
    } catch (error) {
        return createRespondObjectError(res, error);
    }

});

/**remove post */
router.delete('/:postId', verifytoken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletePostInfo = {
            $set: { deleted: 1 }
        };
        var query = { postId: postId, deleted: 0 };
        const deletePost = await Post.findOneAndUpdate(query, deletePostInfo, { new: true });
        return createRespondObjectSuccess(res, deletePost);
    } catch (error) {
        return createRespondObjectError(res, error);
    }

});

module.exports = router;