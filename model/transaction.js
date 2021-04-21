const Joi = require('joi')
const mongoose = require('mongoose');
var { Userdb } = require("../model/user");
var { Book } = require("../model/book");

currentPaySystems = ['dbbl', 'bkash', 'rocket', 'nagad']
const trxSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Userdb, //Model actually
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Userdb, //Model actually
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Book, //Model actually
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1,
        required: true,
    },
    totalPrice: {
        type: Number,
        min: 1,
        default: 1,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: currentPaySystems,
        required: true,
        lowercase: true,
    },
    date: {
        type: Date,
        default: Date.now,
        //required: true,
    }
});


const Transaction = mongoose.model('Transaction', trxSchema);

function validateTransaction(trx) {
    const schema = Joi.object({
        seller: Joi.objectId().required(),
        buyer: Joi.objectId().required(),
        book: Joi.objectId().required(),
        rating: Joi.number().min(0).max(5).required(),
        quantity: Joi.number().integer().min(1).required(),
        //totalPrice: Joi.number().integer().min(1).required(),
        paymentMethod: Joi.any().valid(...currentPaySystems),
        date: Joi.date(),
    });

    const validation = schema.validate(trx);
    return validation;
}

exports.Transaction = Transaction;
exports.trxSchema = trxSchema;
exports.validateTransaction = validateTransaction;