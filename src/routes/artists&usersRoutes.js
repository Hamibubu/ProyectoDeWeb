const router = require('express').Router();
const usersArtistController = require('./../controllers/artists&usersController');
const auth = require('./../middlewares/auth')
const roles = require('./../middlewares/roles')
const file = require('./../middlewares/file')

let rolesList = ['user', 'artist'];

router.get('/welcome',auth,roles('user'),usersArtistController.welcome);

module.exports = router;