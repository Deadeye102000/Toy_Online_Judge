const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required: true
    },
    lastName: {
        type : String,
        required: true  

    },
    email: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true
    }
});

module.exports = mongoose.model('User',userSchema);
// This code defines a Mongoose schema for a User model in a MongoDB database.

// Always ensure to export it as singular as MongoDb automatically makes it plural