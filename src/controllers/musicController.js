const Music = require('./../models/musicModel');
const { response } = require('express');

class MusiController {

    vermusic(req,res) {
        res.send('Página art');
    }

    crearmusic(req,res) {
        res.send('Crear página');
    }

    eliminarmusic(req,res) {
        res.send('Eliminar página');
    }

    // NO USAR MÉTODO INSEGURO
    putmusic(req,res) {
        res.send('');
    }

    editarmusic(req,res) {
        res.send('Editar página');
    }

}

module.exports = new MusiController();