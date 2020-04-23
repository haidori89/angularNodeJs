const {
    User,
    validate
} = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/jpg': 'bmp',
    'image/jpg': 'gif',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 180000000
    },
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        const validmime = MIME_TYPE_MAP[file.mimetype];
        if (!validmime) return cb('file must be image file');

        cb(null, true);
    }
});


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'nodejstest1212@gmail.com',
        pass: '123123hhh'
    },
});






router.post('/', upload.single('image'), async (req, res) => {

    console.log(req.body)
    console.log(req.file.filename);
    const {
        error
    } = validate({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        pic: req.file.filename
    });
    if (error) return res.status(200).send({
        'error': error.details[0].message
    });
    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(200).send({
        'error': "email already exist"
    });


    user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        pic: req.file.filename
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const mailOptions = {
        from: 'nodejstest1212@gmail.com',
        to: user.email,
        subject: 'thank you '+user.name+' for rgister',
        text: 'this is test mail'
    
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        if (!error) return console.log(info);
    })
    res.json({
        success: "user created"
    });
})


router.post('/authUser', authMiddleware, async (req, res) => {
    const user = await (User.findById(req.user._id).select('-password'));
    if (!user) return res.status(400).send('user not found');

    
    res.send(user);
})
module.exports = router;
