const jwt = require('jsonwebtoken');

// estamos recibiendo como argumento el uid - usuario.id
const generarJWT = (uid = '') => { // si no lo manda, lo ponemos asi para que siempre sea un string

    return new Promise((resolve, reject) => {
        const payload = {uid}; // solo grabamos el uid, no más datos

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token); // si todo sale bien, mandamos el token
            }

        }) 
    });

}



module.exports = {
    generarJWT
}