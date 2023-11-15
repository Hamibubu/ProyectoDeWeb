const Artist = require('./../models/artistsModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

class ArtistController {

    async profile(req, res){
        try {
            const artist = await Artist.findOne({ username: req.artist.username });
            
            if (!user) {
                return res.status(404).json({ error: '¿Estás generando una cookie?' });
            }
            console.log(artist)
            res.json();
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
                res.status(500).send("Error interno");
            }
        }
    }

    eliminartist(req,res) {
        res.send('Eliminar artista');
    }

    // NO USAR MÉTODO INSEGURO
    putartist(req,res) {
        res.send('');
    }

    editartist(req,res) {
        res.send('Editar artista');
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
            const userType = "artist"
            const tokenPayload = {
                userType,
                password,
                username
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