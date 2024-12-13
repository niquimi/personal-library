const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    "title": {type: String, required: true},
    "comments": [String],
    "commentcount": Number
});

module.exports = mongoose.model('Book', bookSchema);