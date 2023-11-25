const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    author: { type: String, required: true },
    img: { type: String, required: false },
    comment: { type: String, required: true },
    albumId: { type: String, required: true }
});

module.exports = mongoose.model('AlbumReview', commentSchema);