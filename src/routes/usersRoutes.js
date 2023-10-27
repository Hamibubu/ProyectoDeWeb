const router = require('express').Router();
const usersController = require('./../controllers/usersController');

// Mandar el id del admin
router.get('/user/:userId',usersController.verusuarios);

// Los datos se mandan por post y por json para seguridad
router.post('/login/user', usersController.iniciarsesion);
router.post('/register/user', usersController.crearusuario);

// Editar
router.patch('/user/mod/:id',usersController.editarusuario);

router.delete('/user/:userId',usersController.eliminarusuario);

// Se omite usar el put

module.exports = router;