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

const editRouteHandlers = {
    'user': usersController.editarusuario,
    'artist': artistController.editartist
}

const deleteRouteHandlers = {
    'user': usersController.eliminarusuario,
    'artist': artistController.eliminartist
}

router.get('/welcome',auth,roles(rolesList,welcomeRouteHandlers));
router.get('/profile',auth,roles(rolesList,profileRouteHandlers))
router.patch('/edit',auth,file.single('profilePhoto'),roles(rolesList,editRouteHandlers));
router.delete('/del',auth,roles(rolesList,deleteRouteHandlers));

module.exports = router;