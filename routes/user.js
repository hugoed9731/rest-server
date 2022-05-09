const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index');
// router nos permite llamar esa función
const router = Router();


    router.get('/', usuariosGet);
    

  router.put('/:id',[
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existeUsuarioPorId),
      check('rol').custom( esRoleValido ), // (rol) => esRoleValido(rol) es redundante - el primer elemento que se la manda es el rol, por defecto
      validarCampos
  ], usuariosPut);
  // express ya parsea esto :id y te lo da en una variable

  router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // el nombre no tiene que estar vacío
    check('password', 'El password debe de ser de más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), //QUE EXISTA EN UN ARREGLO .isIn
    // ? validacion del rol contra bd
    check('rol').custom( esRoleValido ), // (rol) => esRoleValido(rol) es redundante - el primer elemento que se la manda es el rol, por defecto
    validarCampos // middleware personalizado que revisa cada uno de los errores de estos checks
  ] , usuariosPost);
  // isEmail - verifica que ese campo sea un correo 

    router.delete('/:id', [
      validarJWT,
      // esAdminRole, // fuerza a que el usuario tenga que ser administrador
      tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROL'), // esta funcion tiene que regresar una funcion
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existeUsuarioPorId),
      validarCampos
    ], usuariosDelete);

    router.patch('/', usuariosPatch);




module.exports = router;