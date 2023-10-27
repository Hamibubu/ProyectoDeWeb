const Usuario = require('./../models/usersModel');
const { response } = require('express');

class UsersController {

    verusuarios(req,res) {
        res.send('Página usuario');
    }

    crearusuario(req,res) {
        res.send('Crear usuario');
    }

    eliminarusuario(req,res) {
        res.send('Eliminar usuario');
    }

    // NO USAR MÉTODO INSEGURO
    putusuario(req,res) {
        res.send('');
    }

    editarusuario(req,res) {
        res.send('Editar artista');
    }

    iniciarsesion(res,req) {
        res.send('Inicia sesión');
    }

}

module.exports = new UsersController();