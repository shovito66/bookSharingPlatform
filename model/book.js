const Joi = require('joi')
const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 3);
var { Userdb } = require("../model/user");
var { Genre } = require("../model/genre");

const bookSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Userdb, //Model actually
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Genre,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true,
    },
    author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true,

    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    // totalPrice: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    availableAmount: {
        type: Number,
        required: true,
        min: 0
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isFreeGiveAway: {
        type: Boolean,
        default: false,
    },

});

const Book = mongoose.model('Book', bookSchema);

function validateBook(book) {
    const schema = Joi.object({
        seller: Joi.objectId().required(),
        genre: Joi.objectId().required(),
        title: Joi.string().min(5).max(50).required(),
        author: Joi.string().min(5).max(50).required(),
        unitPrice: Joi.number().integer().min(0).required(),
        availableAmount: Joi.number().integer().min(0).required(),
        isAvailable: Joi.boolean(),
        isFreeGiveAway: Joi.boolean(),
    });

    const validation = schema.validate(book);
    return validation;
}

exports.validateBook = validateBook;
exports.Book = Book;
exports.bookSchema = bookSchema;