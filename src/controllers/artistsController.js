const Artist = require('./../models/artistsModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

class ArtistController {

    async perfilPublico(req, res){
        try {
            const _id = req.params.artistId;
            const artist = await Artist.findOne({ _id: _id });
            
            const userData = {
                name: artist.name,
                username: artist.username,
                genre: artist.genre,
                description: artist.description,
                Influences: artist.Influences,
                profilePhoto: artist.profilePhoto,
                _id: artist._id
            };

            res.render('./../public/views/artistas/plantillaart.ejs', { userData: userData });

        } catch (error) {
            res.status(500).send('Error al buscar el artista '+error);
        }
    }

    welcome(req, res) {
        const username = req.user.username;
        const userType = req.user.userType;
        res.send(`Bienvenido, ${username} (${userType})`);
    }

    async search(req, res){
        try {
            var query = req.query.name;
            query = query.replace(/[.]/g, '');
            if (!query){
                return res.status(404).send('Introduce una búsqueda válida');
            }
            const regex = new RegExp(`^${query}`, 'i');
            const artists = await Artist.find({ name: regex }).collation({ locale: 'en', strength: 2 });
            if (artists.length === 0) {
                return res.status(404).send('Artista no encontrado');
            }
            const userData = artists.map(artist => ({
                name: artist.name,
                username: artist.username,
                genre: artist.genre,
                profilePhoto: artist.profilePhoto,
                _id: artist._id
            }));

            res.send(userData);
        } catch (error) {
            res.status(500).send('Error al buscar el artista'+error);
        }
    }

    async showAlbums(req, res){
        try {
            const _id = req.params.artistId;
            const artist = await Artist.findOne({ _id: _id });

            if (!artist) {
                return res.status(404).send('Artista no encontrado');
            }

            res.send(artist.albums.map(album => {
                const albumObj = album.toObject ? album.toObject() : album;
                return {
                    _id: albumObj._id,
                    name: albumObj.name,
                    type: albumObj.type,
                    description: albumObj.description,
                    genre: albumObj.genre,
                    albumPhoto: albumObj.albumPhoto,
                    release: albumObj.release,
                    approval: albumObj.likes - albumObj.dislikes
                };
            }));
        } catch (error) {
            res.status(500).send('Error al buscar el artista'+error);
        }
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
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
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
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            res.status(500).send('Hubo un error al registrarlo. Inténtalo de nuevo.');
        }
        if(!req.file) {
            res.status(400).send('Hubo un error al subir la foto de perfil');
            return;
        }
        const existingName = await Artist.findOne({ name: req.body.name }).collation({ locale: 'es', strength: 2 });

        if (existingName) {
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            return res.status(400).send({error: 'Ya existe ese nombre de artista, si necesitas ayuda contáctanos'});
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
            const artistEliminado = await Artist.findOneAndDelete({ _id: _id });
            if(!artistEliminado){
                return res.status(404).send('Usuario no encontrado');
            }
            const directorioAlbumes = path.join(__dirname, '..', 'uploads', 'albumes');
            if (artistEliminado.profilePhoto) {
                const rutaActual = path.join(__dirname, '..', '..', 'uploads', artistEliminado.profilePhoto);
                if (fs.existsSync(rutaActual)) {
                    fs.unlinkSync(rutaActual);
                } else {
                    console.log("Archivo no encontrado en: ", rutaActual);
                }
            }
            if (artistEliminado.albums) {
                for (const album of artistEliminado.albums) {
                    if (artistEliminado.albumPhoto) {
                        const rutaFotoAlbum = path.join(directorioAlbumes, album.albumPhoto);
                        if (fs.existsSync(rutaFotoAlbum)) {
                            fs.unlinkSync(rutaFotoAlbum);
                            console.log(`Foto de álbum eliminada: ${rutaFotoAlbum}`);
                        } else {
                            console.log(`Foto de álbum no encontrada en: ${rutaFotoAlbum}`);
                        }
                    }
                }
            }
            return res.send({ message: 'Artist eliminado correctamente' });
        } catch (error) {
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            console.error('Delete error: '+ error);
            return res.sendStatus(500).send("Error interno"); 
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
            const existingName = await Artist.findOne({ name: req.body.name }).collation({ locale: 'es', strength: 2 });

            if (existingName) {
                return res.status(400).send({error: 'Ya existe ese nombre de artista, si necesitas ayuda contáctanos'});
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
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
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