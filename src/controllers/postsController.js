const Post = require('./../models/postsModel');
const { response } = require('express');

class PostsController {

    verPost(req, res) {
        res.send('Comentario');
    }

    listarPosts(req, res) {
        const foroId = req.params.foroId.slice(1);
        Post.find({foroID: foroId})
        .select('timestamp author img content likes dislikes foroID')
        .then(post => {
            console.log(post);
            // res.render('./../public/views/foros/foroPlantilla.ejs', { foro: foro });
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error al recoger datos' });
        });
    }

    async crearPost(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        // req.body.author = req.user.username; //ESTA ES LA QUE VA, LA LINEA DE ABAJO ES PARA DEV
        req.body.author = 'Usuario';
        console.log(req.body);
        // if (req.file) {
        //     req.body.img = req.file.filename;
        // } else {
        //     req.body.img = '';
        // }
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