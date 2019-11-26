const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);


const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        min: 6
    },
    decription: {
        type: String,
        max: 255,
        min: 6
    },
    deleted:{
        type:Number,
        default:0
    },
    date: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Number,
    }
});
postSchema.plugin(AutoIncrement, { id: 'order_post', inc_field: 'postId' });
module.exports = mongoose.model('Post', postSchema);