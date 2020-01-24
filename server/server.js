const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User} = require('../Models/userModel')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/the-fifth', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log('Error while connecting ..' + err)
    } else {
        console.log('Connected to Database')
    }
})

app.listen(8080, _ => {
    console.log('Listening to 8080 ...');
})
