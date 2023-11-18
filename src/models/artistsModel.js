const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    albumPhoto: { type: String, required: true },
    release: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    genre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    Influences: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    albums: [albumSchema]
});

module.exports = mongoose.model('Artist', artistSchema);
