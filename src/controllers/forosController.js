const Foro = require('./../models/forosModel');
const { response } = require('express');
const path = require('path');
const fs = require('fs');

class ForosController {

    verForo(req, res) {
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

}

module.exports = new ForosController();