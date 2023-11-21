const router = require('express').Router();
const auth = require('./../middlewares/auth');
const roles = require('./../middlewares/roles');
const file = require('./../middlewares/file');
const artistController = require('./../controllers/artistsController');
const usersController = require('./../controllers/usersController');
const secquery = require('./../middlewares/secquery')

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
    'artist': artistController.editarartist
}

const deleteRouteHandlers = {
    'user': usersController.eliminarusuario,
    'artist': artistController.eliminarartist
}

router.get('/welcome',auth,roles(rolesList,welcomeRouteHandlers));
router.get('/profile',secquery,auth,roles(rolesList,profileRouteHandlers))
router.patch('/edit',secquery,auth,file.single('profilePhoto'),roles(rolesList,editRouteHandlers));
router.delete('/del',secquery,auth,roles(rolesList,deleteRouteHandlers));

module.exports = router;