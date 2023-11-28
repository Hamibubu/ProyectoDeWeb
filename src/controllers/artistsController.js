const Artist = require('./../models/artistsModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');
const AlbumReview = require('./../models/albumReviewModel')
const User = require('./../models/usersModel')

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

    async album(req, res) {
        try {
            var pfp = "../../../../assets/img/1.gif";
            if (req.user != "not") {
                const user = await User.findOne({ _id: req.user._id });
                if (!user){
                    const artista = await Artist.findOne({ _id: req.user._id });
                    pfp = "/uploads/"+artista.profilePhoto;
                    const _id = req.params.artistId;
                    const albumId = req.query.albumId;
        
                    const artist = await Artist.findOne({ _id: _id });
        
                    const albumEncontrado = artist.albums.find(album => album._id.equals(albumId));
        
                    albumEncontrado.likes = countProperties(albumEncontrado.likes);
                    albumEncontrado.dislikes = countProperties(albumEncontrado.dislikes);
        
                    let artistData = {
                        name: artist.name,
                        _id: artist._id,
                        pfp: pfp
                    }
        
                    return res.render('./../public/views/artistas/album.ejs', { album: albumEncontrado, artist: artistData});
                }
                pfp = "/uploads/"+user.profilePhoto;
            }
            const _id = req.params.artistId;
            const albumId = req.query.albumId;

            const artist = await Artist.findOne({ _id: _id });

            const albumEncontrado = artist.albums.find(album => album._id.equals(albumId));

            albumEncontrado.likes = countProperties(albumEncontrado.likes);
            albumEncontrado.dislikes = countProperties(albumEncontrado.dislikes);

            let artistData = {
                name: artist.name,
                _id: artist._id,
                pfp: pfp
            }

            res.render('./../public/views/artistas/album.ejs', { album: albumEncontrado, artist: artistData});

            if(!artist){
                return res.status(404).send('Artista no encontrado');
            }
            
        } catch (error) {
            console.log(error)
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

    async deleteAlbum(req, res) {
        try {
            const artistId = req.user._id;
            const albumId = req.params.albumId.slice(1);

            const artist = await Artist.findById(artistId);

            if (!artist) {
                return res.status(404).send('Artista no encontrado');
            }

            const album = artist.albums.id(albumId);

            if (!album) {
                return res.status(404).send('Álbum no encontrado');
            }
    
            await album.deleteOne();
            await artist.save();
    
            return res.status(200).send('Álbum eliminado correctamente');

        } catch (error) {
            console.error('Delete error: '+ error);
            return res.sendStatus(500).send("Error interno");
        }
    }

    async showAlbums(req, res){
        try {
            var _id = req.params.artistId;
            if (!_id) {
                _id = req.user._id;
            }
            const artist = await Artist.findOne({ _id: _id });

            if (!artist) {
                return res.status(404).send('Artista no encontrado');
            }

            res.send(artist.albums.map(album => {
                
                const albumObj = album.toObject ? album.toObject() : album;
                let likes = countProperties(albumObj.likes)
                let dislikes = countProperties(albumObj.dislikes)
                return {
                    _id: albumObj._id,
                    name: albumObj.name,
                    type: albumObj.type,
                    description: albumObj.description,
                    genre: albumObj.genre,
                    albumPhoto: albumObj.albumPhoto,
                    release: albumObj.release,
                    approval: likes - dislikes,
                };
            }));
        } catch (error) {
            res.status(500).send('Error al buscar el artista'+error);
        }
    }
    
    async dislike(req, res) {
        const albumId = req.params.albumId.slice(1);
        const artistId = req.query.artistId;
        const userId = req.user._id;
        let conLikePrevio = false;
        try {
            const artist = await Artist.findOne({ _id: artistId });
            if (!artist) {
                return res.status(404).json({ error: 'Artista no encontrado' });
            }
            const album = artist.albums.find((album) => album._id.equals(albumId));
            if (!album) {
                return res.status(404).json({ error: 'Álbum no encontrado' });
            }

            const likesArray = album.likes;
            const dislikesArray = album.dislikes;

           if (likesArray.includes(userId)){
                likesArray.pull(userId);
                await artist.save();
                conLikePrevio = true;
           }
           if (dislikesArray.includes(userId)){
                dislikesArray.pull(userId);
                await artist.save();
                res.status(200).json({ message: 'Quitaste dislike', conLikePrevio: conLikePrevio });
           } else {
                dislikesArray.push(userId);
                await artist.save();
                res.status(200).json({ message: 'Dislike registrado exitosamente', conLikePrevio: conLikePrevio });
           }

        } catch (err) {
            res.status(500).json({ error: 'Error al registrar dislike'+err });
        }
    }

    async like(req, res) {
        const albumId = req.params.albumId.slice(1);
        const artistId = req.query.artistId;
        const userId = req.user._id;
        let conDislikePrevio = false;
    
        try {
            const artist = await Artist.findOne({ _id: artistId });
            if (!artist) {
                return res.status(404).json({ error: 'Artista no encontrado' });
            }
    
            const album = artist.albums.find((album) => album._id.equals(albumId));
            if (!album) {
                return res.status(404).json({ error: 'Álbum no encontrado' });
            }
    
            const likesArray = album.likes;
            const dislikesArray = album.dislikes;
    
            if (dislikesArray.includes(userId)) {
                dislikesArray.pull(userId);
                await artist.save()
                conDislikePrevio = true;
            } 
            if (likesArray.includes(userId)) {
                likesArray.pull(userId);
                await artist.save()
                res.status(202).json({ message: 'Quitaste like', conDislikePrevio: conDislikePrevio });
            } else {
                likesArray.push(userId);
                await artist.save()
                res.status(200).json({ message: 'Like registrado exitosamente', conDislikePrevio: conDislikePrevio });
            }

        } catch (err) {
            res.status(500).json({ error: 'Error al registrar like' });
        }
    }

    async dislikeRev(req, res) {
        const reviewId = req.params.reviewId.slice(1);
        const userId = req.user._id;
        let conLikePrevio = false;

        try {
            const review = await AlbumReview.findOne({ _id: reviewId });
            if (!review) {
                return res.status(404).json({ error: 'Review no encontrada' });
            }
    
            const likesArray = review.likes;
            const dislikesArray = review.dislikes;
    
            if (likesArray.includes(userId)) {
                likesArray.pull(userId);
                await review.save()
                conLikePrevio = true;
            } 
            if (dislikesArray.includes(userId)) {
                dislikesArray.pull(userId);
                await review.save()
                res.status(202).json({ message: 'Quitaste dislike', conLikePrevio: conLikePrevio });
            } else {
                dislikesArray.push(userId);
                await review.save()
                res.status(200).json({ message: 'Dislike registrado exitosamente', conLikePrevio: conLikePrevio });
            }

        } catch (err) {
            res.status(500).json({ error: 'Error al registrar dislike'+err });
        }
    }
    
    async likeRev(req, res) {
        const reviewId = req.params.reviewId.slice(1);
        const userId = req.user._id;
        let conDislikePrevio = false;

        try {
            const review = await AlbumReview.findOne({ _id: reviewId });
            if (!review) {
                return res.status(404).json({ error: 'Review no encontrada' });
            }
    
            const likesArray = review.likes;
            const dislikesArray = review.dislikes;
    
            if (dislikesArray.includes(userId)) {
                dislikesArray.pull(userId);
                await review.save()
                conDislikePrevio = true;
            } 
            if (likesArray.includes(userId)) {
                likesArray.pull(userId);
                await review.save()
                res.status(202).json({ message: 'Quitaste like', conDislikePrevio: conDislikePrevio });
            } else {
                likesArray.push(userId);
                await review.save()
                res.status(200).json({ message: 'Like registrado exitosamente', conDislikePrevio: conDislikePrevio });
            }

        } catch (err) {
            res.status(500).json({ error: 'Error al registrar like' });
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

    async reviewAlbum(req, res) {
        const timestamp = Date.now();
        req.body.timestamp = timestamp;
        req.body.author = req.user._id;
        if (req.file) {
            req.body.img = req.file.filename;
        } else {
            req.body.img = '';
        }
        const comment = new AlbumReview(req.body);
        try {
            await comment.save();
            res.status(201).send("Comentario creado exitosamente");
        } catch (err) {
            const uri = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
            fs.unlinkSync(uri);
            res.status(400).send('Hubo un error al publicar. Inténtalo de nuevo.');
        }
    }

    async listReviews(req, res){
        try{
            const albumId = req.params.albumId;
            const allrevs = await AlbumReview.find({ albumId: albumId })

            const updatedAllRevs = await Promise.all(allrevs.map(async (rev) => {
                const authorInfo = await User.findOne({ _id: rev.author });
                const updatedRev = {
                    ...rev.toObject(),
                    author: authorInfo.username,
                    profilePhoto: authorInfo.profilePhoto,
                    idAuthor: authorInfo._id.toString(),
                };
                return updatedRev;
            }));
            
            if (req.user == 'not') {
                return res.status(200).send({ allrevs: updatedAllRevs, usuarioActualId: 'not' });
            }
            res.status(200).send({ allrevs: updatedAllRevs, usuarioActualId: req.user._id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async deleteReview(req, res){
        try {
            const reviewId = req.params.reviewId.slice(1);
            const review = await AlbumReview.findByIdAndDelete({ _id: reviewId });
            
            if (!review) {
                return res.status(404).send('Review no encontrado');
            }

            if (review.img) {
                const rutaActual = path.join(__dirname, '..', '..', 'uploads', review.img);
                if (fs.existsSync(rutaActual)) {
                    fs.unlinkSync(rutaActual);
                } else {
                    console.log("Archivo no encontrado en: ", rutaActual);
                }
            }
            return res.send({ message: 'Comanratio eliminado correctamente' });
        } catch (error) {
            if (review.img) {
                const rutaActual = path.join(__dirname, '..', '..', 'uploads', review.img);
                if (fs.existsSync(rutaActual)) {
                    fs.unlinkSync(rutaActual);
                } else {
                    console.log("Archivo no encontrado en: ", rutaActual);
                }
            }
            console.error('Delete error: '+ error);
            return res.sendStatus(500).send("Error interno");
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

function countProperties(obj) {
    let count = 0;
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            count++;
        }
    }
    return count;
}

module.exports = new ArtistController();