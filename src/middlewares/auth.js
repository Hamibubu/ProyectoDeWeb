const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    try {
        // Comprobar si la cookie está presente
        if (!req.headers.cookie) {
            alert("no hay cookie");
            return res.status(401).send({ msg: "Inicia sesión para continuar" });
        }

        // Intentar obtener el token de la cookie
        const cookieParts = req.headers.cookie.split('=');
        if (cookieParts.length < 2) {
            return res.status(401).send({ msg: "Inicia sesión para continuar" });
        }
        const token = cookieParts[1];

        // Verificar el token
        jwt.verify(token, secretKey, (err, decode) => {
            if (err) {
                return res.status(401).send({ msg: "Inicia sesión para continuar" });
            } else {
                req.user = decode;
                next();
            }
        });
    } catch (err) {
        return res.status(401).send(err);
    }
}

module.exports = authMiddleware;