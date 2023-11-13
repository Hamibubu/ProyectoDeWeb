const verifyUserTypeMiddleware = (allowedUserType) => {
    return (req, res, next) => {
        const userType = req.user.userType; 
        if (userType !== allowedUserType) {
            return res.status(403).send({ msg: "Acceso denegado" });
        }
        next();
    };
};

module.exports = verifyUserTypeMiddleware;