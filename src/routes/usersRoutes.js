const router = require('express').Router();
const usersController = require('./../controllers/usersController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file')
const secquery = require('./../middlewares/secquery')

// Los datos se mandan por post y por json para seguridad
router.post('/login/user', secquery,usersController.iniciarsesion);
router.post('/register/user', file.single('profilePhoto'),usersController.crearusuario);

// Se omite usar el put

module.exports = router;