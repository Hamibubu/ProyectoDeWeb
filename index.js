const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const adminRoutes = require('./src/routes/adminsRoutes');
const artistRoutes = require('./src/routes/artistsRoutes');
const commentRoutes = require('./src/routes/commentsRoutes');
const musicRoutes = require('./src/routes/musicRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const usersartistRoutes = require('./src/routes/artists&usersRoutes');
const Usuario = require('./src/models/usersModel');

const app = express();

const corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', usersartistRoutes)
app.use('/api', adminRoutes);
app.use('/api', artistRoutes);
app.use('/api', commentRoutes);
app.use('/api', musicRoutes);
app.use('/api', usersRoutes);

const MONGO = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_INST: process.env.DB_INST
};

const mongoUrl = `${MONGO.DB_HOST}://${MONGO.DB_USER}:${MONGO.DB_PASS}@${MONGO.DB_NAME}/${MONGO.DB_INST}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl).then(() => {
    Usuario.syncIndexes()
            .then(() => {
                console.log("Índices sincronizados correctamente");
            })
            .catch(err => {
                console.error("Error sincronizando índices: ", err);
            });
    app.listen(3000, () => {
        console.log('La app esta funcionando...');
    });
}).catch(err => {
    console.log('No se pudo conectar...', err);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/index/index.html'));
  });
