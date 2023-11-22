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
                        .select('username profilePhoto verified')
                        .then(user => {
                            return {
                                ...post.toObject(), // Convertir el documento de Mongoose a un objeto JS
                                author: user.username,
                                profilePhoto: user.profilePhoto,
                                verified: user.verified
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

    async mostrarModal(req, res) {
        const postId = req.params.postId.slice(1);
        
    }

    async like(req, res) {
        const postId = req.params.postId.slice(1);
        const userId = req.user._id.slice(1);
        let conDislikePrevio = false;
        try {
            const post = await Post.findById(postId);
            if (post.dislikes.includes(userId)) {
                post.dislikes.pull(userId);
                await post.save();
                conDislikePrevio = true;
            }
            if (post.likes.includes(userId)) {
                post.likes.pull(userId);
                await post.save();
                res.status(202).json({ message: 'Quitaste like', conDislikePrevio: conDislikePrevio });
            } else {
                post.likes.push(userId);
                await post.save();
                res.status(200).json({ message: 'Like registrado exitosamente', conDislikePrevio: conDislikePrevio });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al registrar like' });
        }
    }

    async dislike(req, res) {
        const postId = req.params.postId.slice(1);
        const userId = req.user._id.slice(1);
        let conLikePrevio = false;
        try {
            const post = await Post.findById(postId);
            if (post.likes.includes(userId)) {
                post.likes.pull(userId);
                await post.save();
                conLikePrevio = true;
            }
            if (post.dislikes.includes(userId)) {
                post.dislikes.pull(userId);
                await post.save();
                res.status(200).json({ message: 'Quitaste dislike', conLikePrevio: conLikePrevio });
            } else {
                post.dislikes.push(userId);
                await post.save();
                res.status(200).json({ message: 'Dislike registrado exitosamente', conLikePrevio: conLikePrevio });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al registrar dislike' });
        }
    }


    async crearPost(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
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