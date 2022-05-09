const { response, request } = require('express');
// al poner el response obtenemos la ayuda de vs como si usaramos TS
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// Usuario se pone con la primer letra mayuscula, 
// nos va a permitir crear instancias del modelo

const usuariosGet = async(req, res = response) =>  {
    // extrar los paramars que vienen en un query en la url q?=hola&jsus
    // * REFERENCIA . const {q, nombre = 'No name', apikey, page, limit} = req.query;
    // si en la liga no viene el nombre, especificar 

    // el limite ya lo tenemos en la url
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    
    // ! enviar lo dos await de manera simultanea, para que sea mas rapido, y uno no espere al otro
    // poner el await, no sigue hasta que se ejecuten las dos promesas que tiene
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query), 
        Usuario.find(query) // filtramos solo los que tiene estado en true
        .skip(Number(desde))
        .limit(Number(limite)) // transformar el limite en numero, ya que viene de la url como string
    ]); // Promise permite mandar un arreglo con las promesas que quiero que se ejecuten

    res.json({
        total,
        usuarios
    });
}


const usuariosPost = async(req, res = response) =>  {
    // extraer el body
    // el body viene con la información tal cual no la esten mandando
    const {nombre, correo, password, rol} = req.body; // veremos como respuesta todo lo que trae el body
    const usuario = new Usuario({nombre, correo, password, rol});
    // se llena el body con la instacia que hicimos de usuario(modelo)
    
    // * Encriptar password
    const salt = bcryptjs.genSaltSync(); //genSaltSync da más vueltas, encripta mejor la contraseña
    usuario.password = bcryptjs.hashSync(password, salt); //hashSync para encriptarlo en una sola vía

    // ! guardar el registro usuario en la bd
    await usuario.save(); // espera la grabacion

    res.json(usuario);  // solo va a leer campos definidos en el modelo
  }

const usuariosPut = async(req, res) =>  {

    const { id } = req.params;
    const { _id , password, google, correo, ...resto} = req.body;  // extraer lo que no necesito que se grabe
    // google, correo no hacemos nada con ellos por el momento, los quitamos del resto de argumentos

    // * validación de id - debe de hacer match con la bd

    if(password) { // si el password existe significa que el desea actualizar su contraseña
        // * Encriptar password
        const salt = bcryptjs.genSaltSync(); //genSaltSync da más vueltas, encripta mejor la contraseña
        resto.password = bcryptjs.hashSync(password, salt); //hashSync para encriptarlo en una sola vía
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto); // recibe id, y actualiza todo lo del resto


    res.json({
        msg: 'put API - usuariosPUT',
        usuario
    });
  }

const usuariosPatch = (req, res) =>  {
    res.json({
        ok: true,
        msg: 'patch API - usuariosPATCH'
    });
  }

const usuariosDelete = async(req, res) =>  {

    const { id } = req.params;

    // const uid = req.uid;  la request que viene de uid, esto lo obtuvimos en validar-jwt

    // ! borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // ? borrar cambiando el estado del usuario

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}); // el id verificamos si existe en la bd
    // const usuarioAuntenticado = req.usuario;
    // *Obtener usuario autenticado


    res.json(usuario);
  }



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}