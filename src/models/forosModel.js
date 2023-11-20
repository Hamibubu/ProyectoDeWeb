const mongoose = require('mongoose');

const ForoSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    author: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: false },
    verified: { type: Boolean, default: false },
    flags: { type: String, required: false }
});

module.exports = mongoose.model('Foro', ForoSchema);