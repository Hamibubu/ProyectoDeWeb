const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    correo: { type: String, required: true },
    direccion: { type: String, unique: true, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    cp: { type: Number, unique: true, required: true },
    nameT: { type: String, required: true },
    numberT: { type: Number, required: true },
    monthT: { type: Number, default: false },
    yearT: { type: Number, required: true},
    cvv: { type: Number, required: true}
});

module.exports = mongoose.model('Pago', pagoSchema);