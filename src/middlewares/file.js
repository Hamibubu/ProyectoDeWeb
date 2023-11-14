const multer = require('multer');

const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const time = new Date().getTime();
        const name = `${req.body.username}_${time}.${extension}`;
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
