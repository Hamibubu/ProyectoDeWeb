const router = require('express').Router();
const usersController = require('./../controllers/usersController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file')

// Mandar el id del admin
router.get('/user/profile',auth,roles('user'),usersController.profile);

// Los datos se mandan por post y por json para seguridad
router.post('/login/user', usersController.iniciarsesion);
router.post('/register/user', file.single('profilePhoto'),usersController.crearusuario);

// Editar
router.patch('/user/mod/:id',usersController.editarusuario);

router.delete('/user/:userId',usersController.eliminarusuario);

// Se omite usar el put

module.exports = router;