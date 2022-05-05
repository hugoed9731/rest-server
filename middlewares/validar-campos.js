// ESTO ES UN MIDDLEWARE PERSONALIZADO
// No es más que una función
const {validationResult} = require('express-validator');



const validarCampos = (req, res, next) => {
    // express validator es una gran colección de middelwares
    // middelwares funciones que se ejecutan antes de disparar el controlador
    // esto viene del middelware creado en routes/user.js alla se preparaon los errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors); // mando los errores que fueron encontrados por express validator
    } // si hay errores

    // next lo mandamos a llamar si este middleware pasa
    next();

}



module.exports = {
    validarCampos
}