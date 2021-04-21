var { validateBook, bookSchema, Book } = require("../model/book");
var { Userdb } = require("../model/user");
const { match } = require("../util/path");

exports.getAllBooks = async(req, res) => {
    // filter: price,
    // area,
    // isFreeGiveAway,
    // Genre
    const allBooks = await Book.find()
        .populate({
            path: 'seller genre',
            select: 'firstName lastName rating name -_id'
        });
    // Explicitly exclude `_id`,

    //-----------THIS IS OLD--------------------
    // const allBooks = await Book.find()
    //     .select('firstName lastName rating')
    //     .populate('seller');
    //------------------------------------------
    res.send(allBooks);
};


exports.addABook = async(req, res) => {
    // console.log("HII")
    console.log(req.body)
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newBook = new Book({
        seller: req.body.seller,
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        unitPrice: req.body.unitPrice,
        availableAmount: req.body.availableAmount,
        isFreeGiveAway: req.body.isFreeGiveAway,
    });
    if (newBook.availableAmount === 0) {
        newBook.isAvailable = false;
    }

    await newBook.save();
    res.send(newBook);
};

exports.getABook = async(req, res) => {
    try {
        const aBook = await
        Book.findById(req.params.id)
            .populate({
                path: 'seller genre',
                select: 'firstName lastName rating name -_id'
            });
        if (!aBook) return res.status(400).send("Invalid Book.");
        res.send(aBook);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateBook = async(req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const updatedBook = await Book.findByIdAndUpdate(
    //     req.params.id, {
    //         seller: req.body.seller,
    //         title: req.body.title,
    //         author: req.body.author,
    //         unitPrice: req.body.unitPrice,
    //         availableAmount: req.body.availableAmount,
    //         isAvailable: req.body.isAvailable,
    //         isFreeGiveAway: req.body.isFreeGiveAway,

    //     }, { new: true }
    // ).populate({
    //     path: 'seller',
    //     select: 'firstName lastName rating -_id'
    // });
    // if (!updatedBook)
    //     return res.status(404).send("Book with given ID was not found.");
    // res.send(updatedBook);

    const updatedBook = await Book.findById(req.params.id);
    if (!updatedBook)
        return res.status(404).send("Book with given ID was not found.");

    updatedBook.seller = req.body.seller;
    updatedBook.genre = req.body.genre;
    updatedBook.title = req.body.title;
    updatedBook.author = req.body.author;
    updatedBook.unitPrice = req.body.unitPrice;
    updatedBook.availableAmount = req.body.availableAmount;
    if (updatedBook.availableAmount === 0) {
        updatedBook.isAvailable = false;
    } else {
        updatedBook.isAvailable = req.body.isAvailable;
    }
    updatedBook.isFreeGiveAway = req.body.isFreeGiveAway;

    await updatedBook.save()
    res.send(updatedBook);
};

exports.deleteBook = async(req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedBook)
            return res.status(404).send("Book with given ID was not found for deletion.");
        res.send(deletedBook);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteAllBooks = async(req, res) => {
    const deletedAllBooks = await Book.remove();
    if (!deletedAllBooks)
        return res.status(404).send("No Book was found to be deleted");
    res.send("Successfully Deleted All Books");
};