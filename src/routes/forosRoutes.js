const router = require('express').Router();
const foroController = require('./../controllers/forosController');
const file = require('./../middlewares/file')

// Mandar el id del admin
router.get('/foro/:foroId',foroController.verForo);

// Los datos se mandan por post y por json para seguridad
router.post('/foro', file.single('img'), foroController.crearForo);

// Editar
router.patch('/foro/edit',foroController.editarForo);

// Eliminar
router.delete('/foro/delete',foroController.eliminarForo);

// Se omite usar el put

module.exports = router;