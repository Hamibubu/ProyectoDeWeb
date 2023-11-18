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
            const user = await Usuario.findOne({ _id: req.user._id });
            
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
            const salt = await bcrypt.genSalt(10);
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
            const _id = req.user._id;
            const usuarioEliminado = await User.findOneAndDelete({ _id: _id });
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
            const _id = req.user._id;
            let datosActualizacion = req.body;
            const usuarioExistente = await Usuario.findOne({ _id: _id });
            
            if (!usuarioExistente) {
                return res.status(404).send('Usuario no encontrado');
            }

            if (req.body.password && req.body.claveActual){
                const isMatch = await bcrypt.compare(req.body.claveActual, usuarioExistente.password);
                if (!isMatch) {
                    return res.status(401).send({ message: 'Contraseña incorrecta' });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
            }
            if (req.file) {
                if (usuarioExistente.profilePhoto) {
                    const rutaActual = path.join(__dirname, '..', '..', 'uploads', usuarioExistente.profilePhoto);
                    if (fs.existsSync(rutaActual)) {
                        fs.unlinkSync(rutaActual);
                    } else {
                        console.log("Archivo no encontrado en: ", rutaActual);
                    }
                }
                datosActualizacion.profilePhoto = req.file.filename;
            } else {
                delete datosActualizacion.profilePhoto;
            }
            const usuarioActualizado = await Usuario.findOneAndUpdate(
                { _id: _id },
                datosActualizacion,
                { new: true }
            );
            res.send("Usuario modificado exitosamente");
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).send('El username ya está en uso. Por favor, elige otro.');
            }else{
                res.status(500).send('Error al actualizar el usuario');
            }
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
            const { email, username, _id } = user;
            const userType = "user"
            const tokenPayload = {
                userType,
                username,
                email,
                _id
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