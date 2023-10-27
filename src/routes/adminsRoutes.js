const router = require('express').Router();
const adminController = require('./../controllers/adminsController');

// Mandar el id del admin
router.get('/admin/:adminId',adminController.verpanel);

// Los datos se mandan por post y por json para seguridad
router.post('/login/admin', adminController.iniciarsesion);
router.post('/register/admin', adminController.crearadmin);

// Editar
router.patch('/admin/mod/:id',adminController.editadmin);

router.delete('/admin/:adminId',adminController.eliminaradmin);

// Se omite usar el put

module.exports = router;