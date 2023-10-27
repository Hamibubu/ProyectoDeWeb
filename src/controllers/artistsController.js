const Artist = require('./../models/artistsModel');
const { response } = require('express');

class ArtistController {

    verartist(req,res) {
        res.send('Página artista');
    }

    creartist(req,res) {
        res.send('Crear artista');
    }

    eliminartist(req,res) {
        res.send('Eliminar artista');
    }

    // NO USAR MÉTODO INSEGURO
    putartist(req,res) {
        res.send('');
    }

    editartist(req,res) {
        res.send('Editar artista');
    }

    iniciarsesion(res,req) {
        res.send('Inicia sesión');
    }

}

module.exports = new ArtistController();