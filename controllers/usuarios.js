const { response, request } = require('express');
// al poner el response obtenemos la ayuda de vs como si usaramos TS


const usuariosGet = (req, res = response) =>  {


    // extrar los paramar que vienen en un query en la url q?=hola&jsus
    const {q, nombre = 'No name', apikey, page, limit} = req.query;
    // si en la liga no viene el nombre, especificar 
    res.json({
        ok: true,
        msg: 'get API - usuariosGET',
        q,
        nombre,
        page,
        limit
    });
}

const usuariosPost = (req, res) =>  {

    // extraer el body
    // el body viene con la información tal cual no la esten mandando
    const {nombre, edad} = req.body;


    res.json({
        ok: true,
        msg: 'post API - usuariosPOST',
        nombre,
        page,
        limit
    });
  }

const usuariosPut = (req, res) =>  {

    const { id } = req.params;

    res.json({
        ok: true,
        msg: 'put API - usuariosPUT',
        id
    });
  }

const usuariosPatch = (req, res) =>  {
    res.json({
        ok: true,
        msg: 'patch API - usuariosPATCH'
    });
  }

const usuariosDelete = (req, res) =>  {
    res.json({
        ok: true,
        msg: 'delete API - usuariosDELETE'
    });
  }



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}