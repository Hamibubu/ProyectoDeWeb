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
            name = `${req.body.username}_${time}.${extension}`;
        } else if (req.user && req.user.username) {
            name = `${req.user.username}_${time}.${extension}`;
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
