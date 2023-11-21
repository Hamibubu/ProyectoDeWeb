const router = require('express').Router();
const postController = require('./../controllers/postsController');
const file = require('./../middlewares/file')
const auth = require('./../middlewares/auth');
const secquery = require('./../middlewares/secquery')

// Mandar el id del admin
router.get('/post/:postId',secquery,postController.verPost);

router.get('/listar/:foroId',secquery,postController.listarPosts);

// Los datos se mandan por post y por json para seguridad
router.post('/post', auth, file.single('img'), postController.crearPost);

// Editar
router.patch('/post/edit',postController.editarPost);

// Eliminar
router.delete('/post/delete',postController.eliminarPost);

// Se omite usar el put

module.exports = router;