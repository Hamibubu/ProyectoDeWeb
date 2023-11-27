const multer = require('multer');

const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const time = new Date().getTime();
        let name;
        if (req.body.username) {
            // Filtrar y permitir solo caracteres de la A a la Z (mayúsculas y minúsculas)
            const filteredUsername = req.body.username.replace(/[^a-zA-Z]/g, '');
            // Verificar si el nombre filtrado tiene al menos un carácter
            if (filteredUsername.length > 0) {
                name = `${filteredUsername}_${time}.${extension}`;
            } else {
                // Si no quedan caracteres válidos, usa un nombre predeterminado
                name = `default_${time}.${extension}`;
            }
        } else if (req.user && req.user.username) {
            // Similarmente, filtra y permite solo caracteres de la A a la Z en el nombre de usuario existente
            const filteredUsername = req.user.username.replace(/[^a-zA-Z]/g, '');
            if (filteredUsername.length > 0) {
                name = `${filteredUsername}_${time}.${extension}`;
            } else {
                name = `default_${time}.${extension}`;
            }
        } else {
            // Si no hay req.body.username ni req.user.username, usa un nombre predeterminado
            name = `default_${time}.${extension}`;
        }

        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const isValid = validExtensions.includes(extension);
    cb(null, isValid);
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
