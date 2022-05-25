

const validarArchivoSubir = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
       return res.status(400).json({
           msg: 'No hay Archvios que subir - validarArchivoSubir'
        });
      }

    // si todo esto pasa significa que tengo que llamar el next, para que continue con el siguiente middleware

    next();
}


module.exports = {
        validarArchivoSubir
    }