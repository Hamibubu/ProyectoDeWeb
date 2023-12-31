const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    permissions: { type: Number, required: true },
});

module.exports = mongoose.model('Admin', adminSchema);