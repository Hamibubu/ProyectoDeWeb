const Artist = require('./../models/artistsModel');
const { response } = require('express');

class ArtistController {

    verartist(req,res) {
        res.send('Página artista');
    }

    async creartist(req,res) {
        const artist = new Artist(req.body);
        try{
            await artist.save();
            res.status(201).send(artist);
        } catch(err) {
            res.status(500).send(err);
        }
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