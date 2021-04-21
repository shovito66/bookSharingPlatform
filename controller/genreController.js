var { validateGenre, Genre, validateBulkGenres } = require("../model/genre");
var { Userdb } = require("../model/user");
const { match } = require("../util/path");


exports.getAllGenres = async(req, res) => {
    const allGenres = await Genre.find();
    res.send(allGenres);
};

exports.getGenre = async(req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(400).send("Invalid Genre.");
        res.send(genre);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.addGenre = async(req, res) => {

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newGenre = new Genre({
        name: req.body.name
    });

    await newGenre.save();
    res.send(newGenre);
};

exports.bulkInsert = async(req, res) => {
    const { error } = validateBulkGenres(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await Genre.insertMany(req.body);
    res.send(result);
};

exports.updateGenre = async(req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
    }, { new: true });

    if (!updatedGenre)
        return res.status(404).send("Genre with given ID was not found.");

    res.send(updatedGenre);
};

exports.deleteAllGenre = async(req, res) => {
    const deletedAllGenre = await Genre.remove();
    if (!deletedAllGenre)
        return res.status(404).send("No Genre was found to be deleted");
    res.send("Successfully Deleted All Genres");
};


exports.deleteGenre = async(req, res) => {
    try {
        const deletedGenre = await Genre.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedGenre)
            return res.status(404).send("Genre with given ID was not found for deletion.");
        res.send(deletedGenre);

    } catch (error) {
        res.status(500).send(error.message);
    }
};