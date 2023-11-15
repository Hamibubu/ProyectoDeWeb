const verifyUserTypeMiddleware = (allowedUserTypes) => {
    return (req, res, next) => {
        const userType = req.user.userType; 
        if (!allowedUserTypes.includes(userType)) {
            return res.status(403).send({ msg: "Acceso denegado" });
        }
        next();
    };
};

module.exports = verifyUserTypeMiddleware;
