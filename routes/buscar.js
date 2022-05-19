const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

// ? usualmente las peticiones de busqueda son gets - los argumentos se pasan por el url
router.get('/:coleccion/:termino', buscar)




module.exports = router; 