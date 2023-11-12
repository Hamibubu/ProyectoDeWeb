const Usuario = require('./../models/usersModel');
const { response } = require('express');

class UsersController {

    verusuarios(req,res) {
        res.send('Página usuario');
    }

    async crearusuario(req,res) {
        const user = new Usuario(req.body);
        try{
            await user.save();
            res.status(201).send(user);
        } catch(err) {
            res.status(500).send(err);
        }
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