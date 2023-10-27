const router = require('express').Router();
const musicController = require('./../controllers/musicController');

// Mandar el id del admin
router.get('/music/:musicId',musicController.vermusic);

// Los datos se mandan por post y por json para seguridad
router.post('/music',musicController.crearmusic );

// Editar
router.patch('/music/edit',musicController.editarmusic);

// Eliminar
router.delete('/music/delete',musicController.eliminarmusic);

// Se omite usar el put

module.exports = router;