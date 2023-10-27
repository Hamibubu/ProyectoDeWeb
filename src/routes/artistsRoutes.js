const router = require('express').Router();
const artistController = require('./../controllers/artistsController');

// Mandar el id del admin
router.get('/artist/:artistId',);

// Los datos se mandan por post y por json para seguridad
router.post('/login/artist',artistController.iniciarsesion);
router.post('/register/artist',artistController.creartist);

// Editar
router.patch('/artist/mod/:id',artistController.editartist);

// Se utiliza delete
router.delete('/artist/:artistId',artistController.eliminartist);

// Se omite usar el put

module.exports = router;