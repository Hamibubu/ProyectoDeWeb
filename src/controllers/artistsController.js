const Artist = require('./../models/artistsModel');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class ArtistController {

    verartist(req,res) {
        res.send('Página artista');
    }

    async creartist(req,res) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        } catch (err) {
            res.status(500).send('Hubo un error al registrarlo. Inténtalo de nuevo.');
        }
        const artist = new Artist(req.body);
        try {
            await artist.save();
            res.status(201).send("Artista creado exitosamente"); 
        } catch (err) {
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
            const { password, email } = artist;
            const token = jwt.sign({ password, email }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.send({ token });
        } catch (err) {
            console.error('Login error: ', err);
            res.sendStatus(500).send("Error interno"); 
        }
    }

}

module.exports = new ArtistController();