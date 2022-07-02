const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneno: {
        type: Number,
        required: true    
    },
    totalUploadedImages: {
        type: Number,
        required: true,
    }, 
    lastUploadedImage: {
        type: Number,
        required: true,
    }
})


const User = new mongoose.model('User', userSchema);
module.exports = User;