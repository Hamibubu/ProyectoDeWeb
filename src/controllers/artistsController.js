const Artist = require('./../models/artistsModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

class ArtistController {

    welcome(req, res) {
        const username = req.user.username;
        const userType = req.user.userType;
        res.send(`Bienvenido, ${username} (${userType})`);
    }

    async profile(req, res){
        try {
            const artist = await Artist.findOne({ username: req.user.username });
            
            if (!artist) {
                return res.status(404).json({ error: '¿Estás generando una cookie?' });
            }
            const userData = {
                name: artist.name,
                username: artist.username,
                genre: artist.genre,
                description: artist.description,
                Influences: artist.Influences,
                profilePhoto: artist.profilePhoto,
                userType: req.user.userType
            };
            res.json(userData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async creartist(req,res) {
        
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
        const artist = new Artist(req.body);
        try {
            await artist.save();
            res.status(201).send("Artista creado exitosamente"); 
        } catch (err) {
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            if (err.code === 11000) {
                return res.status(400).json({ error: "El email o username ya existe en la base" });
            } else {
                res.status(503).send(err);
            }
        }
    }

    async eliminarartist(req, res) {
        try {
            const username = req.user.username;
            const atistEliminado = await Artist.findOneAndDelete({ username: username });
            if(!artistEliminado){
                return res.status(404).send('Usuario no encontrado');
            }
            res.send({ message: 'Artist eliminado correctamente' });
        } catch (error) {
            console.error('Delete error: ', err);
            res.sendStatus(500).send("Error interno"); 
        }
    }

    // NO USAR MÉTODO INSEGURO
    putartist(req,res) {
        res.send('');
    }

    async editarartist(req, res) {
        try {
            const username = req.user.username;
            const datosActualizacion = req.body;
            const artistActualizado = await Artist.findOneAndUpdate(
                { username: username },
                datosActualizacion,
                { new: true }
            );
            if (!artistActualizado) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.send(artistActualizado);
        } catch (error) {
            res.status(500).send('Error al actualizar el usuario');
        }
    }

    async iniciarsesion(req,res) {
        try{
            const artist = await Artist.findOne({ email: req.body.email });
            if (!artist) {
                return res.status(400).send({ message: 'El email no está registrado' });
            }
            const isMatch = await bcrypt.compare(req.body.password, artist.password);
            if (!isMatch) {
                return res.status(400).send({ message: 'Contraseña incorrecta' });
            }
            const userType = "artist";
            const { email, username } = artist;
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

module.exports = new ArtistController();