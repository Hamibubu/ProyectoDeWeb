const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token,secretKey, (err,decode) => {
        if(err) {
            res.status(401).send({msg: "Inicia sesión para continuar"})
        }else{
            req.user = decode;
            next();
        }
    })
}
module.exports = authMiddleware;