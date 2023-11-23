const router = require('express').Router();
const postController = require('./../controllers/postsController');
const file = require('./../middlewares/file')
const auth = require('./../middlewares/auth');
const secquery = require('./../middlewares/secquery')

// Mandar el id del admin
router.get('/post/:postId',secquery,postController.verPost);

router.get('/listar/:foroId', auth, secquery,postController.listarPosts);

router.get('/mostrarModal/:postId', auth, secquery,postController.mostrarModal);

// Los datos se mandan por post y por json para seguridad
router.post('/post', auth, file.single('img'), postController.crearPost);

router.post('/comentar', auth, file.single('img'), postController.crearComentario);

router.post('/like/:postId', auth, postController.like);

router.post('/dislike/:postId', auth, postController.dislike);

router.post('/likeComment/:commentId', auth, postController.likeComment);

router.post('/dislikeComment/:commentId', auth, postController.dislikeComment);

// Editar
router.patch('/post/edit',postController.editarPost);

// Eliminar
router.delete('/post/delete/:postId', auth, postController.eliminarPost);

router.delete('/comentario/delete/:commentId', auth, postController.eliminarComentario);

// Se omite usar el put

module.exports = router;