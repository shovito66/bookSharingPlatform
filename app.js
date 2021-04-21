//jshint esversion:6
const path = require('path');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connectDB = require('./database/connection');

const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })
app.set('view engine', 'ejs');
app.set('views', 'views'); //if default name fof view folder change then need to mention here

app.use(morgan('tiny')); // this module helps us to log incoming url
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();


/*
app.get("/", function(req, res) {
    console.log("HOME PAGE");
    products = []
    res.render('home', {
        prods: products,
        pageTitle: 'HOME',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
    // Post.find({}, function(err, posts) {
    //     res.render("home", {
    //         startingContent: homeStartingContent,
    //         posts: posts
    //     });
    // });
});

*/

app.use(express.json()); ///needs for parsing the request body of the post request
//--------------------API--------------------
app.use("/", require('./routes/admin'));
app.use("/api/user", require('./routes/user'));
app.use("/api/book", require('./routes/book'));
app.use("/api/genre", require('./routes/genre'));
app.use("/api/trx", require('./routes/transaction'));



app.use(function(req, res) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    //res.status(404).render('404', { pageTitle: 'Page Not Found' })
});

const port = process.env.PORT || 3000;


app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});