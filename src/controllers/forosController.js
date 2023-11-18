const Foro = require('./../models/forosModel');
const { response } = require('express');

class ForosController {

    verForo(req, res) {
        res.send('Comentario');
    }

    async crearForo(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        // req.body.author = req.user.username; //ESTA ES LA QUE VA, LA LINEA DE ABAJO ES PARA DEV
        req.body.author = 'Usuario';
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