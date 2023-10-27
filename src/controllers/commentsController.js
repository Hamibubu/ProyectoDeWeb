const Comment = require('./../models/commentsModel');
const { response } = require('express');

class CommentsController {

    vercomment(req,res) {
        res.send('Comentario');
    }

    crearcomentario(req,res) {
        res.send('Crear comentario');
    }

    eliminarcomentario(req,res) {
        res.send('Eliminar comentario');
    }

    // NO USAR MÉTODO INSEGURO
    putcomment(req,res) {
        res.send('');
    }

    editarcomentario(req,res) {
        res.send('Editar comantario');
    }

}

module.exports = new CommentsController();