const joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    pic: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        pic: this.pic,
    }, config.get('jwtkey'));
    return token;
}



const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const schema = joi.object({
        name: joi.string().min(2).max(255).required(),
        username: joi.string().min(6).max(255).required(),
        email: joi.string().min(6).max(255).required().email(),
        password: joi.string().min(6).max(1024).required(),
        pic: joi.string().required(),
    })

    return schema.validate(user);
}


exports.User = User;

exports.validate = validateUser;
