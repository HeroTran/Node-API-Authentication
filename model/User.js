const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);


const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    deleted: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Number,
    }
});

userSchema.plugin(AutoIncrement, { id: 'order_user', inc_field: 'userId' });
module.exports = mongoose.model('User', userSchema);