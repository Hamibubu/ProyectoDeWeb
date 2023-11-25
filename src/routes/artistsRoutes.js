const router = require('express').Router();
const artistController = require('./../controllers/artistsController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file');
const secquery = require('./../middlewares/secquery')

// Los datos se mandan por post y por json para seguridad
router.post('/login/artist',secquery,artistController.iniciarsesion);
router.post('/register/artist',file.single('profilePhoto'),artistController.creartist);
router.post('/register/albums',auth,roles(['artist'],{'none':'none'}),file.single('albumPhoto'),artistController.registeralbum);
router.post('/album/like/:albumId',auth,artistController.like);
router.post('/album/dislike/:albumId',auth,artistController.dislike);
router.post('/review',auth,roles(['user'],{'none':'none'}),file.single('img'),artistController.reviewAlbum);

router.get('/albums/show/:artistId',secquery,artistController.showAlbums);
router.get('/search',secquery,artistController.search);
router.get('/artist/public/:artistId',secquery,artistController.perfilPublico);
router.get('/albums/show/spec/:artistId',artistController.album);
router.get('/show/reviews/:albumId',artistController.listReviews);

module.exports = router;