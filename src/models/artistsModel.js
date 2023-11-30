const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    albumPhoto: { type: String, required: true },
    release: { type: String, required: true },
    likes: { type: Array, required: true },
    dislikes: { type: Array, required: true }
});

const artistSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    genre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    Influences: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    albums: [albumSchema]
});

artistSchema.index({ name: 1 }, { collation: { locale: 'es', strength: 2 } });

module.exports = mongoose.model('Artist', artistSchema);
