const router = require('express').Router();
const artistController = require('./../controllers/artistsController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file');
const artistsController = require('./../controllers/artistsController');

// Mandar el id del admin
router.get('artist/profile',auth,roles('artist'),artistsController.profile);

// Los datos se mandan por post y por json para seguridad
router.post('/login/artist',artistController.iniciarsesion);
router.post('/register/artist',file.single('profilePhoto'),artistController.creartist);

// Editar 
router.patch('/artist/mod/:id',artistController.editartist);

// Se utiliza delete
router.delete('/artist/:artistId',artistController.eliminartist);

// Se omite usar el put

module.exports = router;