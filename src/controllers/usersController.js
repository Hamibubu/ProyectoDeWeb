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

    async iniciarsesion(req, res) {
        // Buscar al usuario por email
        const user = await Usuario.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: 'El email no está registrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        // const isMatch = await compare(req.body.pwd, user.pwd);
        // if (!isMatch) {
        //     return res.status(400).send({ message: 'Contraseña incorrecta' });
        // }
        if (req.body.pwd !== user.password) {
            return res.status(400).send({ message: 'Contraseña incorrecta' });
        }

        // Si todo está bien, responder con el usuario
        res.send(user);
    }

}

module.exports = new UsersController();