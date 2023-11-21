const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    author: { type: String, required: true },
    img: { type: String, required: false },
    content: { type: String, required: true },
    likes: { type: Array, required: false },
    dislikes: { type: Array, required: false },
    foroID: { type: String, required: true }
});

module.exports = mongoose.model('Post', PostSchema);