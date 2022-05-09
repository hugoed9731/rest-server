const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')


const { login } = require('../controllers/auth');


// router nos permite llamar esa función
const router = Router();


router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es oblogatoria').not().isEmpty(),
    validarCampos
], login);



module.exports = router;