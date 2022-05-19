const { response } = require('express');
const { Categoria } = require('../models');

    // populate nos permite hacer la relación con el usuario
    // populate - practicamente es una llave foranea
    const obtenerCategorias = async(req, res = response) => {

        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };


        const [total, categorias ] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query) // filtramos solo los de estado: true
            .populate('usuario', 'nombre') // mandamos referencia a usuario
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.json({
            total,
            categorias
        })
    }

// * Obtener categoria - populate { }

const obtenerCategoria = async(req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

// * Crear categoria

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); // leemos el nombre que viene en el body - lo capitalizo

    const categoriaDB = await Categoria.findOne({nombre}); // consultar si existe una categoria con ese nombre

    if(categoriaDB) { // si la categoria existe tira este null
        return res.status(400).json({   
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // tiene que ser un id de mongo
        // no ponemos el estado porque ese se nos puede mandar desde el front, y va a estar cambiando 
    }

    const categoria = new Categoria(data); // lo crea lo prepara, pero aún no lo manda a la bd

    // Guardad DB 
    await categoria.save(); 

    res.status(201).json(categoria);

    // cuando se crea algo usualmente se manda el 201


}

// * Actualizar Categoria

const actualizarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body; // no mandamos estos datos, estado y usuario

    // datos de la persona que esta haciendo esta acción de actualizar
    data.nombre = data.nombre.toUpperCase(); // PASAMOS EL NOMBRE A MAYUSACULAS
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria); // si todo sale bien, todo salio correctamente
}

// * borrar categoria - cambiar el estado a false

const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    // new en true, para que se vean los cambios en la respuesta json
    res.json(categoriaBorrada);
}   


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}