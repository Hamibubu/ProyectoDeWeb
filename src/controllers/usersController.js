const Usuario = require('./../models/usersModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsersController {

    verusuarios(req, res) {
        res.send('Página usuario');
    }

    async crearusuario(req, res) {
        try {
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            // Crear el objeto de usuario con la contraseña encriptada
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        } catch (err) {
            res.status(500).send('Hubo un error al registrarlo. Inténtalo de nuevo.');
        }
        const user = new Usuario(req.body);
        try {
            await user.save();
            res.status(201).send("Usuario creado exitosamente"); 
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({ error: "El email o username ya existe en la base" });
            } else {
                res.status(500).send("Error interno");
            }
        }
    }

    eliminarusuario(req, res) {
        res.send('Eliminar usuario');
    }

    // NO USAR MÉTODO INSEGURO
    putusuario(req, res) {
        res.send('');
    }

    editarusuario(req, res) {
        res.send('Editar artista');
    }

    async iniciarsesion(req, res) {
        try{
            // Buscar al usuario por email
            const user = await Usuario.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'El email no está registrado' });
            }
            //Comparar la contraseña proporcionada con la almacenada en la base de datos METODO ENCRIPTADO
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).send({ message: 'Contraseña incorrecta' });
            }
            const { password, email } = user; // Extrae el _id y email del objeto user
            const token = jwt.sign({ password, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.send({ token });
        } catch (err) {
            console.error('Login error: ', err);
            res.sendStatus(500).send("Error interno"); 
        }
    }

}

module.exports = new UsersController();