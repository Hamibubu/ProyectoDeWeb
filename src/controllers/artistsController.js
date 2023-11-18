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

    async registeralbum(req, res){ 
        try{
            req.body.albumPhoto = req.file.filename;
            const artist = await Artist.findOne({ _id: req.user._id });
            if (!artist) {
                return res.status(404).json({ error: '¿Estás generando una cookie?' });
            }
            const existingAlbum = artist.albums.find(album => album.name === req.body.name);
            if (existingAlbum) {
                return res.status(400).json({ error: 'Ya existe un álbum con este nombre.' });
            }
            if (!artist.albums) {
                artist.albums = [];
            }    
            artist.albums.push(req.body);
            await artist.save();
            res.status(200).json({ message: 'Álbum agregado con éxito.' });
        } catch(err){
            console.log(err);
            res.status(500).json({ error: 'Error al agregar el álbum.' });
        }
    }

    async profile(req, res){
        try {
            const artist = await Artist.findOne({ _id: req.user._id });
            
            if (!artist) {
                return res.status(404).json({ error: '¿Estás generando una cookie?' });
            }
            const userData = {
                name: artist.name,
                username: artist.username,
                genre: artist.genre,
                email: artist.email,
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
            const _id = req.user._id;
            const atistEliminado = await Artist.findOneAndDelete({ _id: _id });
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
            const _id = req.user._id;
            let datosActualizacion = req.body;
            const artistaExistente = await Artist.findOne({ _id: _id });
            
            if (!artistaExistente) {
                return res.status(404).send('Usuario no encontrado');
            }

            if (req.body.password && req.body.claveActual){
                const isMatch = await bcrypt.compare(req.body.claveActual, artistaExistente.password);
                if (!isMatch) {
                    return res.status(401).send({ message: 'Contraseña incorrecta' });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
            }

            if (req.file) {
                if (artistaExistente.profilePhoto) {
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

            const artistActualizado = await Artist.findOneAndUpdate(
                {  _id: _id },
                datosActualizacion,
                { new: true }
            );
            if (!artistActualizado) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.send("Usuario modificado exitosamente");
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).send('El username ya está en uso. Por favor, elige otro.');
            }else{
                res.status(500).send('Error al actualizar el usuario');
            }
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
            const { email, username, _id } = artist;
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

module.exports = new ArtistController();