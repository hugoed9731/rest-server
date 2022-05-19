const { response } = require('express');
const { Producto } = require('../models');

// ? NOTA SOBRE POPULATE
/*
     Esta permite llenar ciertas partes del documento
      desde otra colección. Supongamos que tenemos 
      las colecciones publicaciones y autores. 
      Podemos agregar una referencia a las 
      publicaciones desde el esquema de autores.
*/

// * Obtener productos

const obtenerProductos = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}

// *OBTENER PRODUCTO
const obtenerProducto = async(req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')


    res.json(producto);
}

// * Crear producto

const crearProducto = async(req, res = response) => {
    // capitalizamos el nombre que viene en el body
    const {estado, usuario, ...body} = req.body;
    // estado y usuario - seran ignorados
    // consultar si existe un producto con ese nombre en bd
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB) { // si el nombre existe muestra este error
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar en la db
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
        
        // ! tiene que ser un id de mongo
    }

    // lo creamos, lo preparamos, pero aun no lo mandamos
    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    // ? siempre que se crea algo manda un status 201
    res.status(201).json(producto);
}

// * ACTUALIZAR CATEGORIA

const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    // ignoramos estos datos

    // datos de la persona que esta haciendo la acción de actualizar
    // consultar si viene el nombre
    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto); // toddo salio correctamente
}
// * BORRAR PRODUCTO

const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    // new en true es para que se vean los cambios en la resp
    res.json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}