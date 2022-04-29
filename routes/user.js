

const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
// router nos permite llamar esa función
const router = Router();


    router.get('/', usuariosGet);
    

  router.put('/:id', usuariosPut );
  // express ya parsea esto :id y te lo da en una variable

  router.post('/', usuariosPost);

    router.delete('/', usuariosDelete);

    router.patch('/', usuariosPatch);




module.exports = router;