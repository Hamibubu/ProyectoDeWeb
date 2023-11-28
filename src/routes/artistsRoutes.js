const router = require('express').Router();
const artistController = require('./../controllers/artistsController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file');
const lOn = require('./../middlewares/loggedOrNot');
const secquery = require('./../middlewares/secquery')

// Los datos se mandan por post y por json para seguridad
router.post('/login/artist',secquery,artistController.iniciarsesion);
router.post('/register/artist',file.single('profilePhoto'),artistController.creartist);
router.post('/register/albums',auth,roles(['artist'],{'none':'none'}),file.single('albumPhoto'),artistController.registeralbum);
router.post('/album/like/:albumId',secquery,auth,artistController.like);
router.post('/album/dislike/:albumId',secquery,auth,artistController.dislike);
router.post('/review',auth,roles(['user'],{'none':'none'}),file.single('img'),artistController.reviewAlbum);
router.post('/review/dislike/:reviewId', secquery, auth, artistController.dislikeRev);
router.post('/review/like/:reviewId', secquery, auth, artistController.likeRev);

router.get('/albums/show/:artistId',secquery,artistController.showAlbums);
router.get('/search',secquery,artistController.search);
router.get('/artist/public/:artistId',secquery,artistController.perfilPublico);
router.get('/albums/show/spec/:artistId',secquery,lOn,artistController.album);
router.get('/show/reviews/:albumId',lOn,secquery,artistController.listReviews);

router.delete('/review/del/:reviewId',auth,secquery,artistController.deleteReview);

module.exports = router;