const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apellido: { type: String, required: true },
    username: { type: String, required: true },
    genres: { type: String, required: true },
    albumfav: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type:String, required: true },
    phone: { type:String, required: true }
});

module.exports = mongoose.model('User', userSchema);