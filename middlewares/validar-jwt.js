const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    // * obtener el jwt de donde venga
    // si es un token de acceso se acostumbra a que vaya en los headers
    // ? leer los headers
    const token = req.header('x-token');

    if(!token) { // si no hay un token manda este error
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        // * VALIDAR JWT
       const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // segundo parametro es el secretkey

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        // si no encuentra nigún usuario con el uid que muestre este mensaje
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }
        // *VERIFICAR SI EL UID TIENE ESTADO EN TRUE
        // preguntar si el usuario no ha sido eliminado, si ha sido eliminado no puede ejecutar la accion

        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}



module.exports = {
    validarJWT
}