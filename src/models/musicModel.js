const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    artist: { type: String, required: true },
    genre: { type: String, required: true },
    albums: { type: String, required: true },
    rating: { type: String, required: true },
    song: { type: String, required: true },
    description: { type: String, required: true },
    Influences: { type:String, required: true }
});

module.exports = mongoose.model('Music', musicSchema);