const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


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


module.exports = {
    login
}