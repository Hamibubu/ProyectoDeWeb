const Post = require('./../models/postsModel');
const { response } = require('express');

class PostsController {

    verPost(req, res) {
        res.send('Comentario');
    }

    async crearPost(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        // req.body.author = req.user.username; //ESTA ES LA QUE VA, LA LINEA DE ABAJO ES PARA DEV
        req.body.author = 'Usuario';
        const post = new Post(req.body);
        try {
            await post.save();
            res.status(201).send("Post creado exitosamente");
        } catch (err) {
            res.status(400).send('Hubo un error al publicar. Inténtalo de nuevo.');
        }
    }

    eliminarPost(req, res) {
        res.send('Eliminar comentario');
    }

    // NO USAR MÉTODO INSEGURO
    putPost(req, res) {
        res.send('');
    }

    editarPost(req, res) {
        res.send('Editar comantario');
    }

}

module.exports = new PostsController();