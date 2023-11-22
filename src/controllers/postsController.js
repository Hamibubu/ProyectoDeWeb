const Post = require('./../models/postsModel');
const Comment = require('./../models/commentsModel');
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
        .sort({ timestamp: -1 }) // Orden descendente
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

    mostrarModal(req, res) {
        const postId = req.params.postId.slice(1);
        Comment.find({ postId: postId })
            .sort({ timestamp: -1 }) // Orden descendente
            .then(comments => {
                const userPromises = comments.map(comment =>
                    Usuario.findById(comment.author)
                        .select('username profilePhoto verified')
                        .then(user => {
                            return {
                                ...comment.toObject(),
                                author: user.username,
                                profilePhoto: user.profilePhoto,
                                verified: user.verified
                            };
                        })
                );
                Promise.all(userPromises)
                    .then(updatedComments => {
                        res.status(200).json({ comments: updatedComments, postId: postId, user: req.user });
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'Error al recoger datos de usuarios' });
                    });
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al recoger datos de posts' });
            });
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

    async likeComment(req, res) {
        const commentId = req.params.commentId.slice(1);
        const userId = req.user._id.slice(1);
        let conDislikePrevio = false;
        try {
            const comment = await Comment.findById(commentId);
            if (comment.dislikes.includes(userId)) {
                comment.dislikes.pull(userId);
                await comment.save();
                conDislikePrevio = true;
            }
            if (comment.likes.includes(userId)) {
                comment.likes.pull(userId);
                await comment.save();
                res.status(202).json({ message: 'Quitaste like', conDislikePrevio: conDislikePrevio });
            } else {
                comment.likes.push(userId);
                await comment.save();
                res.status(200).json({ message: 'Like registrado exitosamente', conDislikePrevio: conDislikePrevio });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al registrar like' });
        }
    }

    async dislikeComment(req, res) {
        const commentId = req.params.commentId.slice(1);
        const userId = req.user._id.slice(1);
        let conLikePrevio = false;
        try {
            const comment = await Comment.findById(commentId);
            if (comment.likes.includes(userId)) {
                comment.likes.pull(userId);
                await comment.save();
                conLikePrevio = true;
            }
            if (comment.dislikes.includes(userId)) {
                comment.dislikes.pull(userId);
                await comment.save();
                res.status(200).json({ message: 'Quitaste dislike', conLikePrevio: conLikePrevio });
            } else {
                comment.dislikes.push(userId);
                await comment.save();
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

    async crearComentario(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        req.body.author = req.user._id;
        if (req.file) {
            req.body.img = req.file.filename;
        } else {
            req.body.img = '';
        }
        const comment = new Comment(req.body);
        try {
            await comment.save();
            res.status(201).send("Comentario creado exitosamente");
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