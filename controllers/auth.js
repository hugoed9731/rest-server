const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {


    const { correo, password} = req.body;

    try {

        // * VERIFICAR SI EL EMAIL EXISTE
        
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){ // si no existe el usuario
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        } 

        // * VERIFICAR SI EL USUARIO ESTA ACTIVO EN MI BD
    
        if(!usuario.estado){ // si no es true muestra el error
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            });
        } 

        // *VERIFICAR LA CONTRASEÑA

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        /* compareSync compara que el password(password) que nos estan mandando haga match con 
        el que tenemos en la bd(usuario.password) */
        if(!validPassword){ // si el password no es valido
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })

        }

        // *GENERAR EL JWT(TOKEN)
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}


const googleSignIn = async( req, res = response ) => {
    
    const { id_token } = req.body;

    try {
        
    const {nombre, img, correo} = await googleVerify(id_token);

    // * verificar si el correo YA EXISTE EN LAS BASES DE DATOS

    let usuario = await Usuario.findOne({correo});

    if(!usuario) { // ! SI EL USUARIO NO EXISTE
        // tengo que crearlo
        const data = { // esta es la data que vamos a terminar mandando
            nombre, // estos datos son los mismos que tenemos alla arriba
            correo,
            password: ':P',
            img,
            rol: "USER_ROLE",
            google: true
        };

        usuario = new Usuario(data);
        await usuario.save();  // lo grabamos en la bd
    }

    // *  SI EL USUARIO EN BD ESTA COMO TRUE

    if(!usuario.estado){
        return res.status(401).json({
            msg: 'Hable con el adminstrador, usuario bloqueado'
        });
    }
    
    // *GENERAR EL JWT(TOKEN)
    const token = await generarJWT(usuario.id); // el id de mongo

    res.json({
        usuario,
        token
    });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}


module.exports = {
    login,
    googleSignIn
}