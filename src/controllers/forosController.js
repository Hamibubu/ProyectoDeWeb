const Foro = require('./../models/forosModel');
const Usuario = require('./../models/usersModel');
const Artist = require('./../models/artistsModel');
const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

class ForosController {

    verForo(req, res) {
        const foroId = req.params.foroId.slice(1);
        Foro.findById(foroId)
            .select('timestamp author name description img verified flags')
            .then(foro => {
                res.status(200).json(foro);
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al recoger datos' });
            });
    }

    verForos(req, res) {
        Foro.find()
            .select('timestamp author name description img verified flags')
            .then(foros => {
                res.status(200).json(foros);
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al recoger datos' });
            });
    }

    async crearForo(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        // req.body.author = req.user.username; //ESTA ES LA QUE VA, LA LINEA DE ABAJO ES PARA DEV
        req.body.author = 'Usuario';
        if (req.file) {
            req.body.img = req.file.filename;
        } else {
            req.body.img = 'foroSinImagen.png';
        }
        const foro = new Foro(req.body);
        try {
            await foro.save();
            res.status(201).send("Foro creado exitosamente");
        } catch (err) {
            res.status(400).send('Hubo un error al publicar. Inténtalo de nuevo.');
        }
    }

    eliminarForo(req, res) {
        res.send('Eliminar comentario');
    }

    // NO USAR MÉTODO INSEGURO
    putForo(req, res) {
        res.send('');
    }

    editarForo(req, res) {
        res.send('Editar comantario');
    }

    async entrarForo(req, res) {
        try {
            const foroId = req.params.foroId.slice(1);
            const foro = await Foro.findById(foroId)
                .select('timestamp author name description img verified flags');
    
            let usuario;
            const user = await Usuario.findById(req.user._id).select('profilePhoto');
            if (!user) {
                const artist = await Artist.findById(req.user._id).select('profilePhoto');
                usuario = artist;
            } else {
                usuario = user;
            }
    
            res.render('./../public/views/foros/foroPlantilla.ejs', { foro: foro, user: usuario });
        } catch (err) {
            res.status(500).json({ error: 'Error al recoger datos' });
        }
    }

}

module.exports = new ForosController();