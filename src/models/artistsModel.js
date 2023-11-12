const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    genre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    Influences: { type:String, required: true }
});

module.exports = mongoose.model('Artist', artistSchema);