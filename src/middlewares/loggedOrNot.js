const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    try {
        // Comprobar si la cookie está presente
        if (!req.headers.cookie) {
            alert("no hay cookie");
            req.user="not";
            next();
        }

        // Intentar obtener el token de la cookie
        const cookieParts = req.headers.cookie.split('=');
        if (cookieParts.length < 2) {
            req.user = "not";
            next();
        }
        const token = cookieParts[1];

        // Verificar el token
        jwt.verify(token, secretKey, (err, decode) => {
            if (err) {
                req.user = "not";
                next();
            } else {
                req.user = decode;
                next();
            }
        });
    } catch (err) {
        req.user = "not";
        next();
    }
}

module.exports = authMiddleware;