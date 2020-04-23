const {
    User
} = require('../models/user');
const bcrypt = require('bcrypt');
const joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const {
        error,
        value
    } = validate(req.body);

    console.log(req.body)
        if (error) return res.status(200).send({
            'error': error.details[0].message
        });

        let user = await User.findOne({
            email: req.body.email
        });
        if (!user) return res.status(200).send({
            'error': 'invalid email or password'
        });

        const validpassword = await bcrypt.compare(req.body.password, user.password);

        if (!validpassword) return res.status(200).send({
            'error': 'invalid email or password'
        });


        res.json({
            token: user.generateAuthToken()
        });
})


function validate(req) {
    const schema = joi.object({
        email: joi.string().min(6).max(255).required(),
        password: joi.string().min(6).max(1024).required()
    });
    return schema.validate(req);
}

module.exports = router;
