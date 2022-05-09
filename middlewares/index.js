const validarCampos  = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validarCampos, // todo lo que exporte esa ruta validar campos lo exportamos aqui
    ...validarJWT,
    ...validaRoles
}