const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

// {{url}}/api/categorias

// *OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', obtenerCategorias);

// *OBTENER UNA CATEGORIA POR ID - PUBLICO
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);


// * CREAR CATEGORIA - PRIVADO CUALQUIER ROL cualquier persona con token válido

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// * ACTUALIZAR PRIVADO CUALQUIERA CON TOKEN VALIDO
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // si no mandas el nombre no se que quieras actualizar
    check('id').custom(existeCategoriaPorId), //tiene que existir el id
    validarCampos
], actualizarCategoria);

// * BORRAR UNA CATEGORIA - ADMIN

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), //tiene que existir el id
    validarCampos
], borrarCategoria);




module.exports = router;