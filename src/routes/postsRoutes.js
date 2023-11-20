const router = require('express').Router();
const postController = require('./../controllers/postsController');
const file = require('./../middlewares/file')

// Mandar el id del admin
router.get('/post/:postId',postController.verPost);

router.get('/listar/:foroId',postController.listarPosts);

// Los datos se mandan por post y por json para seguridad
router.post('/post', file.single('img'), postController.crearPost);

// Editar
router.patch('/post/edit',postController.editarPost);

// Eliminar
router.delete('/post/delete',postController.eliminarPost);

// Se omite usar el put

module.exports = router;