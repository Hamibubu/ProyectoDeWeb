const router = require('express').Router();
const auth = require('./../middlewares/auth');
const roles = require('./../middlewares/roles');
const file = require('./../middlewares/file');
const artistController = require('./../controllers/artistsController');
const usersController = require('./../controllers/usersController');

let rolesList = ['user', 'artist'];

const profileRouteHandlers = {
    'user': usersController.profile,
    'artist': artistController.profile
};

const welcomeRouteHandlers = {
    'user': usersController.welcome,
    'artist': artistController.welcome
};

router.get('/welcome',auth,roles(rolesList,welcomeRouteHandlers));
router.get('/profile',auth,roles(rolesList,profileRouteHandlers))

module.exports = router;