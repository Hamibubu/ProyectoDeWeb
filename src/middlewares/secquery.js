const { query, body, validationResult } = require('express-validator');

const sanitizeAndValidateQuery = [
  // Verificar y sanitizar req.query.name si existe
  query('name')
    .optional()
    .trim()
    .escape(),

  // Verificar y sanitizar req.body._id si existe
  body('_id')
    .optional()
    .trim()
    .escape(),

  body('email')
    .optional()
    .trim()
    .escape(),

  // Verificar si hay errores de validación
  (req, res, next) => {
    if (req.query.name) {
        req.query.name = req.query.name.replace(/[|=&{}$"]/g, ''); // Realizar el replace en query.name
    }
    if (req.body._id) {
        req.body._id = req.body._id.replace(/[=|&{}$"]/g, ''); // Realizar el replace en body._id
    }
    if (req.body.email){
        req.body.email = req.body.email.replace(/[=|&$"]/g, '');
    }
    if (req.params.foroId){
        req.params.foroId = req.params.foroId.replace(/[=|&$"]/g, '');
    }
    if (req.params.foroId) {
        req.params.foroId = req.params.foroId.replace(/[=|&$"]/g, '');
    }
    if (req.params.reviewId) {
        req.params.reviewId = req.params.reviewId.replace(/[=|&$"]/g, '');
    }
    if (req.query.artistId) {
        req.query.artistId = req.query.artistId.replace(/[=|&$"]/g, '');
    }
    if (req.params.albumId) {
      req.params.albumId = req.params.albumId.replace(/[=|&$"]/g, '');
    }
    if (req.params.artistId) {
      req.params.artistId = req.params.artistId.replace(/[=|&$"]/g, '');
    }
    if (req.params.commentId) {
      req.params.commentId = req.params.commentId.replace(/[=|&$"]/g, '');
    }
    if (req.params.postId) {
      req.params.postId = req.params.postId.replace(/[=|&$"]/g, '');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = sanitizeAndValidateQuery;
