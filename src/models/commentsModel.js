const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    author: { type: String, required: true },
    img: { type: String, required: false },
    comment: { type: String, required: true },
    likes: { type: Array, required: false },
    dislikes: { type: Array, required: false },
    postId: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);