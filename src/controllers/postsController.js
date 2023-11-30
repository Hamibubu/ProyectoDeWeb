const Post = require('./../models/postsModel');
const Comment = require('./../models/commentsModel');
const Usuario = require('./../models/usersModel');
const Artist = require('./../models/artistsModel');
const jwt = require('jsonwebtoken');
const { response } = require('express');

class PostsController {

    verPost(req, res) {
        res.send('Comentario');
    }

    async listarPosts(req, res) {
        try {
            const foroId = req.params.foroId.slice(1);
            const page = req.query.page ? parseInt(req.query.page) : 0;
    
            const posts = await Post.find({ foroID: foroId })
                .sort({ timestamp: -1 })
                .skip(10 * page)
                .limit(10)
                .select('timestamp author img content likes dislikes foroID');
    
            const now = new Date();
    
            for (const post of posts) {
                const hoursSinceCreation = Math.abs(now - post.timestamp) / 36e5;
                let score = post.likes.length + post.dislikes.length;
    
                if (hoursSinceCreation < 1) {
                    score += 10;
                }
    
                score -= hoursSinceCreation / 24;
                post.score = score;
            }
    
            posts.sort((a, b) => b.score - a.score);
    
            const userPromises = posts.map(async (post) => {
                let user;
                user = await Usuario.findById(post.author)
                    .select('username profilePhoto verified');
                if (!user){
                    user = await Artist.findById(post.author)
                        .select('username profilePhoto');
                }
                return {
                    ...post.toObject(),
                    author: user.username,
                    authorId: user._id,
                    profilePhoto: user.profilePhoto,
                    verified: user.verified || (user instanceof Artist)
                };
            });

            const updatedPosts = await Promise.all(userPromises);
    
            res.status(200).json({
                posts: updatedPosts,
                usuarioActualId: req.user._id 
            });
        } catch (err) {
            res.status(500).json({ error: 'Error al recoger datos de posts o usuarios'+err });
        }
    }

    async mostrarModal(req, res) {
        try {
            const postId = req.params.postId.slice(1);
    
            const comments = await Comment.find({ postId: postId })
                .sort({ timestamp: -1 });
    
            const now = new Date();
    
            for (const comment of comments) {
                const hoursSinceCreation = Math.abs(now - comment.timestamp) / 36e5;
                const score = comment.likes.length - comment.dislikes.length - hoursSinceCreation / 24;
                comment.score = score;
            }
    
            comments.sort((a, b) => b.score - a.score);

            const userPromises = comments.map(async (comment) => {
                let user;
                user = await Usuario.findById(comment.author).select('username profilePhoto verified _id');
                if(!user){
                    user = await Artist.findById(comment.author).select('username profilePhoto');
                }
                return {
                    ...comment.toObject(),
                    author: user.username,
                    profilePhoto: user.profilePhoto,
                    verified: user.verified || (user instanceof Artist),
                    authorId: user._id
                };
            });
    
            const updatedComments = await Promise.all(userPromises);
            if (req.user.userType == "artist") {
                const artist = await Artist.findOne({ _id: req.user._id  });
                req.user.profilePhoto = artist.profilePhoto;
            }
            res.status(200).json({ comments: updatedComments, postId: postId, user: req.user });
        } catch (err) {
            res.status(500).json({ error: 'Error al recoger datos de comentarios o usuarios'+err });
        }
    }

    eliminarPost(req, res) {
        const postId = req.params.postId.slice(1);
        const userId = req.user._id;
        Post.findById(postId)
            .then(post => {
                if (!post) {
                    return res.status(404).json({ error: 'Post no encontrado' });
                }
                if (post.author !== userId) {
                    return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
                }

                return Post.findByIdAndRemove(postId);
            })
            .then(() => {
                res.json({ message: 'Post eliminado con éxito' });
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al eliminar el post' });
            });
    };

    eliminarComentario(req, res) {
        const commentId = req.params.commentId.slice(1);
        const userId = req.user._id; // Asumiendo que estás usando autenticación
        Comment.findById(commentId)
            .then(comment => {
                if (!comment) {
                    return res.status(404).json({ error: 'Comentario no encontrado' });
                }
    
                if (comment.author !== userId) {
                    return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
                }
    
                return Comment.findByIdAndRemove(commentId);
            })
            .then(() => {
                res.json({ message: 'Comentario eliminado con éxito' });
            })
            .catch(err => {
                res.status(500).json({ error: 'Error al eliminar el comentario' });
            });
    };

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


    // NO USAR MÉTODO INSEGURO
    putPost(req, res) {
        res.send('');
    }

    editarPost(req, res) {
        res.send('Editar comantario');
    }

}

module.exports = new PostsController();