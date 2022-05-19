 const { response } = require("express");
 const { ObjectId } = require('mongoose').Types;


 const {Usuario, Categoria, Producto} = require('../models')
 
// usemos este arreglo para validar si existe en la petición alguna de estas
 coleccionesPermitidas = [
     'usuarios',
     'categorias',
     'productos',
     'roles'
 ];

 const buscarUsuarios = async(termino = '', res = response) => {

    // validar si el termino es un mongo id
    const esMongoID = ObjectId.isValid(termino); // si es un id de mongo regresa true

    if(esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({ // return para que ya no siga ejecutando nada de la función
            results: ( usuario ) ? [ usuario ] : [] 
                    // evitamos que nos reponda null vale!
        });
    }

    // busquedas incensibles - nos recupera todo lo que tenga relacion con lo que ingresamos en la busqueda
    // RegExp - una expresión regular que ya viene hecha en js
    const regex = new RegExp( termino, 'i' ); // 'i' - es incesible a las mayusculas y minusculas
    // ? podemos poner count para saber cuantas respuestas hay en esa peticion
    const usuarios = await Usuario.find({
        // tiene que cumplir esta condición o esta otra condicion - condiciones en la bd
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}] // tambien tiene que cumplir esta de acá
    });

    res.json({
        results: usuarios
    });


 }

    const buscarCategorias = async(termino = '', res = response) => {

    // validar si el termino es un mongo id
    const esMongoID = ObjectId.isValid(termino); // si es un id de mongo regresa true

    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({ // return para que ya no siga ejecutando nada de la función
            results: ( categoria ) ? [ categoria ] : [] 
                    // evitamos que nos reponda null vale!
        });
    }

    // busquedas incensibles - nos recupera todo lo que tenga relacion con lo que ingresamos en la busqueda
    // RegExp - una expresión regular que ya viene hecha en js
    const regex = new RegExp( termino, 'i' ); // 'i' - es incesible a las mayusculas y minusculas
    // ? podemos poner count para saber cuantas respuestas hay en esa peticion
    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias
    });
 }

 const buscarProductos = async(termino = '', res = response) => {

    // validar si el termino es un mongo id
    const esMongoID = ObjectId.isValid(termino); // si es un id de mongo regresa true

    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({ // return para que ya no siga ejecutando nada de la función
            results: ( producto ) ? [ producto ] : [] 
                    // evitamos que nos reponda null vale!
        });
    }

    // busquedas incensibles - nos recupera todo lo que tenga relacion con lo que ingresamos en la busqueda
    // RegExp - una expresión regular que ya viene hecha en js
    const regex = new RegExp( termino, 'i' ); // 'i' - es incesible a las mayusculas y minusculas
    // ? podemos poner count para saber cuantas respuestas hay en esa peticion
    const productos = await Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre')

    res.json({
        results: productos
    });


 }
 
 const buscar = async(req, res = response) => {

     const { coleccion, termino } = req.params;

     if(!coleccionesPermitidas.includes(coleccion)) { // si la incluye sigue todo el procedimiento
        // pero si no "!"
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }` 
        })
     }

     switch (coleccion) {
         case 'usuarios':
             buscarUsuarios(termino, res);
         break;   
         case 'categorias':
             buscarCategorias(termino, res);
         break;
         case 'productos':
             buscarProductos(termino, res);
         break;


         default:
             res.status(500).json({
                 msg: 'Se me olvido hacer esta busqueda'
             })
     }



 }


 module.exports = {
     buscar
 }