const router = require('express').Router();
const User = require('../model/User');
const { verifytoken } = require('../utils/verifytoken');
const jwt = require('jsonwebtoken');
const { createObjectPagination, createRespondObjectError, createRespondObjectSuccess } = require('../utils/helpers');

/**get all user have pagination */
router.get("/", verifytoken, async (req, res) => {
    try {
        var pageNumber = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 10;
        var query = { "deleted": 0 };
        User.find(query)
            .sort({ userId: -1 })
            .skip(pageNumber * limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return res.json(err);
                }
                User.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    return createObjectPagination(res, count, pageNumber, doc.length, doc);
                });
            });
    } catch (error) {
        res.status(400).send(error);
    }
});

/**get user detail */
router.get('/:userId', verifytoken, async (req, res) => {
    try {
        const userId = req.params.userId;
        var query = { deleted: 0, userId: userId };
        const userDetail = await User.findOne(query);
        return createRespondObjectSuccess(res, userDetail);
    } catch (error) {
        return createRespondObjectError(res, error);
    }
});

/**update user */
router.put('/:userId', verifytoken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateUserInfo = {
            $set: {
                title: req.body.title,
                decription: req.body.decription,
            }
        };
        var query = { userId: userId, deleted: 0 };
        const updateUser = await user.findOneAndUpdate(query, updateUserInfo, { new: true });
        return createRespondObjectSuccess(res, updateUser);
    } catch (error) {
        return createRespondObjectError(res, error);
    }

});

/**remove user */
router.delete('/:userId', verifytoken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const deleteUserInfo = {
            $set: { deleted: 1 }
        };
        var query = { userId: userId, deleted: 0 };
        const deleteUser = await user.findOneAndUpdate(query, deleteUserInfo, { new: true });
        return createRespondObjectSuccess(res, deleteUser);
    } catch (error) {
        return createRespondObjectError(res, error);
    }

});



module.exports = router;