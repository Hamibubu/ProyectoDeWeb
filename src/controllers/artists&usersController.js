const Usuario = require('./../models/usersModel');
const Artist = require('./../models/artistsModel');

class ArtistsUsers {
    welcome(req, res) {
        const username = req.user.username;
        const userType = req.user.userType;
        res.send(`Bienvenido, ${username} (${userType})`);
    }
}

module.exports = new ArtistsUsers();