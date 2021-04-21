// const jwt = require('jsonwebtoken');
const Joi = require('joi')
const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 3);


genderEnum = ['male', 'female', 'others']

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        //required: true
    },
    phone: {
        type: String,
        required: true,
        maxlength: 14,
    },
    // isAdmin: Boolean,
    isAdmin: {
        type: Boolean,
        default: false
    },
    // userRole: {
    //     type: String,
    //     enum: ['admin', 'user'],
    //     required: function() {
    //         return this.isAdmin == false;
    //     }
    // },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
        required: true,
        lowercase: true,
    },
    DOB: {
        type: Date,
        required: true,
        min: '2003-01-01', //YYYY-MM-DD
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 255,
    },
    // rating: {
    //     type: Number,
    //     default: 0.0,
    //     min: 0,
    //     max: 5,
    // },
    rating: {
        type: Float,
        default: 0.0,
        min: 0,
        max: 5,
    },

});

const Userdb = mongoose.model('User', userSchema);



function validateUser(user) {

    /////-----------------_THIS APPROACH IS NOT WORK FOR THE V16 VERSION-------------

    // const schema = {
    //     firstName: Joi.string().min(5).max(50).required(),
    //     lastName: Joi.string().min(5).max(50).required(),
    //     email: Joi.string().min(5).max(255).required().email(),
    //     password: Joi.string().min(5).max(255),
    //     //isAdmin: Joi.boolean(),
    //     gender: Joi.boolean().required(),
    //     // DOB: Joi.date().format('YYYY-MM-DD').options({ convert: false }),
    //     address: Joi.string().min(5).max(255),
    //     phone: Joi.string().max(14),
    // };

    //return Joi.validate(user, schema);

    const schema = Joi.object({
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255),
        isAdmin: Joi.boolean(),
        gender: Joi.any().valid(...genderEnum), //Don't accept array
        DOB: Joi.date(),
        address: Joi.string().min(5).max(255),
        phone: Joi.string().max(14),
        rating: Joi.number().precision(2).min(0).max(5)
    });

    const validation = schema.validate(user);
    return validation;
}

// module.exports = Userdb;
exports.Userdb = Userdb;
exports.userSchema = userSchema;
exports.validateUser = validateUser;