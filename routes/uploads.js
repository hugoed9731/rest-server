const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');


// router nos permite llamar esa función
const router = Router();


// * CREAR UN NUEVO RECURSO - OSEA SUBIR UN ARCHIVO NUEVO

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    // recibimos la coleccion y el arreglo de coleccioes permitidas
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])), // aqui mandamos la coleccion que estoy recibiendo
    validarCampos
], actualizarImagenCloudinary)
// actualizarImagen


router.get('/:coleccion/:id', [ 
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    // recibimos la coleccion y el arreglo de coleccioes permitidas
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])), // aqui mandamos la coleccion que estoy recibiendo
], mostrarImagen)


// ¡Que es el custom


module.exports = router;