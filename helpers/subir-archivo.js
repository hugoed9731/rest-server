const path = require('path') // este metodo es util para poder crear estos urls
// no permite crear estos urls
const { v4: uuidv4 } = require('uuid');

// pedimos en los argumentos, que carpeta es donde quiero que se almacene
const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => { // extraemos la req.files desde aqui
    // CUANDO ESPERAMOS QUE ALGO SALGA  BIEN, O QUE SALGA MAL, ES RECOMENDABLE UTILIZAR PROMESAS


    return new Promise((resolve, reject) => {

           // establecer lo que viene en la req.files en este caso en archivo que es nuestra peticion
    const { archivo } = files;


    // * VALIDAR QUE EXTENSION ES 
    // split permite cortar el string
    const nombreCortado = archivo.name.split('.'); // es el identificador para separarlo y crear el arreglo
    console.log(nombreCortado);
    const extension = nombreCortado[nombreCortado.length - 1]; // necesitamos la ultima posicion

    // * validar la extension
    // arreglo que contiene todas las extenciones validas
    // const extensionesValidas = []; esto lo pasamos arriba - las vamos a recibir como argumento opcional
    // extension, es la extensión que yo tengo, la que se manda practicamente
    if(!extensionesValidas.includes(extension)) {
       return reject(`La extensión ${ extension } no es permitida, ${ extensionesValidas }`);
    }


const nombreTemp = uuidv4() + '.' + extension; // nombre temporal del archivo va a ser igual a lo que se genere de uuid
//   construcción del path a donde quiero colocar ese archivo
// si la carpeta es un string vacío, el join lo identificara sin problema
  const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
//   el __dirname llega hasta el controller
    // * La string __dirname proporciona la ruta del
    // * directorio del módulo actual, esto también es similar a la de path.dirname() del nombre del archivo

//   mv es la funcion de mover- mueve el path a donde lo quiero colocar
  archivo.mv(uploadPath, (err) => {
    if (err) {
      reject(err);
    }

    resolve(nombreTemp);
  });

    });
}


module.exports = {
    subirArchivo
}