
const path = require('path');  // path ya esta incluido en node
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); // configuramos para que verifique mi cuena

const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');


const {Usuario, Producto} = require('../models')


const cargarArchivo = async(req, res = response) => {

    // si no hay una propiedad files(archivo) - regresa un 404
    // hace un barrido checa si al menos viene una propiedad ahi
    //   si tambien en archivo no viene mandar el mensaje de error

    // ! ESTE CODIGO LOS CONVERTIMOS EN UN MIDDLEWARE YA QUE SE REPETIA VARIAS VECES
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json({msg: 'No hay Archvios que subir'});
  //   return;
  // }


//   ? UTILIZANDO HELPER DONDE ESTA TODA LA LOGICA PARA SUBIR EL ARCHIVO
//   QUE VAMOS A RECIBIR - EL PATH COMPLETO

try {
// imagenes - mandamos las que vienen por defecto entonces no tenemos que colocar nada
//  const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
// undifined - ocupamos argumento por defecto 
 const nombre = await subirArchivo(req.files, undefined, 'imgs'); // necesitamos ocupar todos lo elemento a fuerza
  res.json({nombre})
} catch (msg) {
  res.status(400).json({
    msg
  })
}

}

const actualizarImagen = async(req, res=response) => {

  
    const { id, coleccion } = req.params;

    let modelo; // establecemos su valor de manera condicional


    switch (coleccion) {
      case 'usuarios':
        // verificar si esta coleccion tiene un id
        modelo = await Usuario.findById(id);
        if(!modelo){
          return res.status.json(400)({
            msg: `No existe un usuario con el id ${id}`
          });
        } // si el modelo no existe - No hacemos nada si no existe
        break;

        case 'productos':
          // verificar si esta coleccion tiene un id
          modelo = await Producto.findById(id);
          if(!modelo){
            return res.status(400).json({
              msg: `No existe un producto con el id ${id}`
            });
          } // si el modelo no existe - No hacemos nada si no existe
          break;

      default:
        return res.status(500).json({
          msg: 'Se me olvidó validar esto'
        })
    }
    // ? ELIMINAR FOTO POSTERIOR, PARA EVITAR TENER UN BASUSERO - QUE NO SE ACUMULEN LAS FOTOS

    // limpirar imagenes previas - primer paso
    if(modelo.img) { // si el modelo tiene la propiedad img establecida
      // borrar la img del servidor
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); // apuntamos a la ruta para llegar a uploads
      
      // si existe esto regresa un true, aqui verifica que la img exista en alguna coleccion
      if(fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); // aqui es donde se borrar el archivo
      }
    }

    // coleccion, depende de cual sea crea la carpeta - puede ser usuarios/productos
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre; 

    await modelo.save();

    res.json(modelo)
}

const actualizarImagenCloudinary = async(req, res=response) => {

  
  const { id, coleccion } = req.params;

  let modelo; // establecemos su valor de manera condicional


  switch (coleccion) {
    case 'usuarios':
      // verificar si esta coleccion tiene un id
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status.json(400)({
          msg: `No existe un usuario con el id ${id}`
        });
      } // si el modelo no existe - No hacemos nada si no existe
      break;

      case 'productos':
        // verificar si esta coleccion tiene un id
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        } // si el modelo no existe - No hacemos nada si no existe
        break;

    default:
      return res.status(500).json({
        msg: 'Se me olvidó validar esto'
      })
  }
  // ? ELIMINAR FOTO POSTERIOR, PARA EVITAR TENER UN BASUSERO - QUE NO SE ACUMULEN LAS FOTOS

  //* limpirar imagenes previas - primer paso
  // ! extraer el id que le asigna clodinary a cada imagen, para evitar tener imagenes dobles
  if(modelo.img) { // si el modelo tiene la propiedad img establecida
      const nombreArr = modelo.img.split('/'); // separamos el arreglo por /
      const nombre = nombreArr[nombreArr.length -1 ]; // obtenemos la ultima posicion donde viene el id
      const [public_id] = nombre.split('.') // split genera un arreglo , genera un nuevo arreglo cortandolo por el punto
      // console.log(public_id); Obtenemos el id previo, que es el que vamos a borrar

      cloudinary.uploader.destroy(public_id);
  }

  // * mandamos el path temporal a cloudynari
  const { tempFilePath } = req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath); // desestructuramos de la respuesta el secure_url
  // clodynari expone una propiedad llamada uploaded
  // secure url - contiene la direccion de la imagen que se subio en cloudinary
  modelo.img = secure_url; 

  await modelo.save();

  res.json(modelo);
}


  const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params; // lo que viene en el url, pero es dinamico, pude variar la data

    let modelo; // establecemos su valor de manera condicional

    switch (coleccion) {
      case 'usuarios':
        // verificar si esta coleccion tiene un id
        modelo = await Usuario.findById(id);
        if(!modelo){
          return res.status.json(400)({
            msg: `No existe un usuario con el id ${id}`
          });
        } // si el modelo no existe - No hacemos nada si no existe
        break;

        case 'productos':
          // verificar si esta coleccion tiene un id
          modelo = await Producto.findById(id);
          if(!modelo){
            return res.status(400).json({
              msg: `No existe un producto con el id ${id}`
            });
          } // si el modelo no existe - No hacemos nada si no existe
          break;

      default:
        return res.status(500).json({
          msg: 'Se me olvidó validar esto'
        })
    }
    // ? ELIMINAR FOTO POSTERIOR, PARA EVITAR TENER UN BASUSERO - QUE NO SE ACUMULEN LAS FOTOS

    // limpirar imagenes previas - primer paso
    if(modelo.img) { // si el modelo tiene la propiedad img establecida
      // borrar la img del servidor
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); // apuntamos a la ruta para llegar a uploads
      
      // si existe esto regresa un true, aqui verifica que la img exista en alguna coleccion
      if(fs.existsSync(pathImagen)) {
        // respondemos la imagen, practicamente hacemos un get de la imagen
        return res.sendFile(pathImagen);
      }
    }

    // puedo usar esto porque son variables de scope, osea se pueden llamar igual
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);

  } 


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}