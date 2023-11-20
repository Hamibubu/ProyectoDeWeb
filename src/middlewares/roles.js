const verifyUserTypeMiddleware = (allowedUserTypes, routeHandlers) => {
    return (req, res, next) => {
        const userType = req.user.userType;
        if (allowedUserTypes.length === 1 && userType == allowedUserTypes[0]) {
            return next();
        }
        const handler = routeHandlers[userType];
        if (handler && allowedUserTypes.includes(userType)) {
            return handler(req, res, next);
        } else {
            return res.status(403).send({ msg: "Tipo de usuario no reconocido o no permitido" });
        }
    };
};

module.exports = verifyUserTypeMiddleware;