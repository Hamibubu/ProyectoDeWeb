const router = require('express').Router();
const commentController = require('./../controllers/commentsController');

// Mandar el id del admin
router.get('/comment/:commentId',commentController.vercomment);

// Los datos se mandan por post y por json para seguridad
router.post('/comment', commentController.crearcomentario);

// Editar
router.patch('/comment/edit',commentController.editarcomentario);

// Eliminar
router.delete('/comment/delete',commentController.eliminarcomentario);

// Se omite usar el put

module.exports = router;