const Admin = require('./../models/adminsModel');
const { response } = require('express');

class AdminController {

    verpanel(req,res) {
        res.send('Panel de admin');
    }

    crearadmin(req,res) {
        res.send('Crear admin');
    }

    eliminaradmin(req,res) {
        res.send('Eliminar admin');
    }

    // NO USAR MÉTODO INSEGURO
    putadmin(req,res) {
        res.send('');
    }

    editadmin(req,res) {
        res.send('Editar admin');
    }

    iniciarsesion(res,req) {
        res.send('Inicia sesión');
    }

}

module.exports = new AdminController();