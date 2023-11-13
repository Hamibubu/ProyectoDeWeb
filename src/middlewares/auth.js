const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    try{
        const token = req.headers.cookie.split('=')[1];
        jwt.verify(token,secretKey, (err,decode) => {
            if(err) {
                res.status(401).send({msg: "Inicia sesión para continuar"})
            }else{
                req.user = decode;
                next();
            }
        })
    } catch (err) {
        res.status(401).send(err);
    }
}
module.exports = authMiddleware;