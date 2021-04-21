const Fawn = require('fawn');
const mongoose = require('mongoose');
var { validateTransaction, trxSchema, Transaction } = require("../model/transaction");
var { Userdb } = require("../model/user");
var { Book } = require("../model/book");
const { match } = require("../util/path");

Fawn.init(mongoose);
exports.getAllTransaction = async(req, res) => {
    const allTranscations = await Transaction.find().populate({
        path: 'seller buyer book',
        select: 'firstName lastName rating genre title author unitPrice isFreeGiveAway',
    });
    res.send(allTranscations);
};

exports.getATransaction = async(req, res) => {
    try {
        const aTransaction = await Transaction.findById(req.params.id).populate({
            path: 'seller buyer book',
            select: 'firstName lastName rating genre title author unitPrice isFreeGiveAway',
        });
        if (!aTransaction) return res.status(400).send("Invalid Transaction.");
        res.send(aTransaction);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.addATransaction = async(req, res) => {
    console.log(req.body)
    const { error } = validateTransaction(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newTrx = new Transaction({
        seller: req.body.seller,
        buyer: req.body.buyer,
        book: req.body.book,
        rating: req.body.rating,
        quantity: req.body.quantity,
        //totalPrice: req.body.totalPrice,
        paymentMethod: req.body.paymentMethod,
    });
    soldBook = await Book.findById(req.body.book);
    newTrx.totalPrice = newTrx.quantity * soldBook.unitPrice;

    // await newTrx.save();
    // res.send(newTrx);

    // .update('users', {
    //     _id: {
    //         $in: [newTrx.seller, newTrx.buyer]
    //     },
    //     $push: { transactions: newTrx }
    // })

    // .update('books', { _id: newTrx.book }, {
    //     $cond: {
    //         $if: { $eq: ["$availableAmount", 0] },
    //         $then: {
    //             $set: {
    //                 isAvailable: false
    //             }
    //         }
    //     }
    // })
    if ((soldBook.availableAmount - newTrx.quantity) < 0) {
        res.status(500).send("Quantity is greater than available books");
    } else {
        try {
            var task = Fawn.Task()
            task
                .save('transactions', newTrx)
                .update('books', { _id: newTrx.book }, {
                    $inc: { availableAmount: -newTrx.quantity },
                });
            if ((soldBook.availableAmount - newTrx.quantity) === 0) {
                //console.log("I Am in")
                task.update('books', { _id: newTrx.book }, {
                    $set: {
                        isAvailable: false
                    }
                });
            }
            task.run();
            res.send(newTrx);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};
/**
 * No need for updating a transaction
 */


exports.deleteTransaction = async(req, res) => {
    try {
        const deletedTrx = await Transaction.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedTrx)
            return res.status(404).send("Trx with given ID was not found for deletion.");
        res.send(deletedTrx);

    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.deleteAllTransactions = async(req, res) => {
    const deletedAllTransactions = await Transaction.remove();
    if (!deletedAllTransactions)
        return res.status(404).send("No Trx was found to be deleted");
    res.send("Successfully Deleted All Transcations");
};