const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true,
        trim: true,
        unique: true
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}


function validateBulkGenres(genres) {
    // console.log(genres)
    let schema = Joi.array().items(
        Joi.object({
            name: Joi.string().min(3).required(),
        })
    )

    return schema.validate(genres);
}


exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.validateBulkGenres = validateBulkGenres