const Usuario = require('./../models/usersModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

class UsersController {

    welcome(req, res) {
        const username = req.user.username;
        const userType = req.user.userType;
        res.send(`Bienvenido, ${username} (${userType})`);
    }

    async profile(req, res){
        try {
            const user = await Usuario.findOne({ username: req.user.username });
            
            if (!user) {
                return res.status(404).json({ error: '¿Estás generando una cookie?' });
            }
            const userData = {
                albumfav: user.albumfav,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto,
                phone: user.phone,
                genres: user.genres,
                username: user.username,
                apellido: user.apellido,
                userType: req.user.userType
            };
            res.json(userData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
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
        if(!req.file) {
            res.status(400).send('Hubo un error al subir la foto de perfil');
            return;
        }
        req.body.profilePhoto = req.file.filename;
        const user = new Usuario(req.body);
        try {
            await user.save();
            res.status(201).send("Usuario creado exitosamente"); 
        } catch (err) {
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            if (err.code === 11000) {
                return res.status(400).json({ error: "El email o username ya existe en la base" });
            } else {
                console.log(err)
                res.status(500).send("Error interno");
            }
        }
    }

    async eliminarusuario(req, res) {
        try {
            const username = req.user.username;
            const usuarioEliminado = await User.findOneAndDelete({ username: username });
            if(!usuarioEliminado){
                return res.status(404).send('Usuario no encontrado');
            }
            res.send({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Delete error: ', err);
            res.sendStatus(500).send("Error interno"); 
        }
    }

    // NO USAR MÉTODO INSEGURO
    putusuario(req, res) {
        res.send('');
    }

    async editarusuario(req, res) {
        try {
            const username = req.user.username;
            const datosActualizacion = req.body;
            const usuarioActualizado = await Usuario.findOneAndUpdate(
                { username: username },
                datosActualizacion,
                { new: true }
            );
            if (!usuarioActualizado) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.send(usuarioActualizado);
        } catch (error) {
            res.status(500).send('Error al actualizar el usuario');
        }
    }

    async iniciarsesion(req, res) {
        try{
            const user = await Usuario.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'El email no está registrado' });
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).send({ message: 'Contraseña incorrecta' });
            }
            const { email, username } = user;
            const userType = "user"
            const tokenPayload = {
                userType,
                username,
                email
            }
            const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.send({ token });
        } catch (err) {
            console.error('Login error: ', err);
            res.sendStatus(500).send("Error interno"); 
        }
    }

}

module.exports = new UsersController();