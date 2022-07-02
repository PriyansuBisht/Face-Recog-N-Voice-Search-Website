const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({ 
    name: {
        type: String,
        unique: true
    },
    Image: {
        type: String,
    },
    category: {
        type: String
    },
    genre: {
        type: String
    },
    type: {
        type: String
    },
    pages: {
        type: String
    },
    author: {
        type: String
    },
    series: {
        type: String
    },
    partNo: {
        type: String
    },
    totalparts: {
        type: String
    },
    prequel: {
        type: String
    },
    sequel: {
        type: String
    },
    note: {
        type: String
    },
    summary: {
        type: String
    },
    publicationdate: {
        type: String
    },
    publishedby: {
        type: String
    }
})

const Book = new mongoose.model('Book', bookSchema);
module.exports = Book;