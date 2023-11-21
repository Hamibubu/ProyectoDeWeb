const Post = require('./../models/postsModel');
const Usuario = require('./../models/usersModel');
const jwt = require('jsonwebtoken');
const { response } = require('express');

class PostsController {

    verPost(req, res) {
        res.send('Comentario');
    }

    listarPosts(req, res) {
        const foroId = req.params.foroId.slice(1);
        Post.find({ foroID: foroId })
            .select('timestamp author img content likes dislikes foroID')
            .then(posts => {
                const userPromises = posts.map(post => 
                    Usuario.findById(post.author)
                        .select('username profilePhoto')
                        .then(user => {
                            return {
                                ...post.toObject(), // Convertir el documento de Mongoose a un objeto JS
                                author: user.username,
                                profilePhoto: user.profilePhoto
                            };
                        })
                );

                // Esperar a que todas las promesas se resuelvan
                Promise.all(userPromises)
                    .then(updatedPosts => {
                        res.status(200).json(updatedPosts);
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'Error al recoger datos de usuarios' });
                    });
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al recoger datos de posts' });
            });
    }

    async crearPost(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        console.log(req.user);
        req.body.author = req.user._id;
        if (req.file) {
            req.body.img = req.file.filename;
        } else {
            req.body.img = '';
        }
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