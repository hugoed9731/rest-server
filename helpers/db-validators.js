const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async(rol = '') => { // custom recibe el valor que estoy evaluando
    const existeRol = await Role.findOne({rol});
    // si este objecto existe significa que si esta grabado en la coleccion de la bd
    if(!existeRol) { //! pero si no existe
      throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
  }

    // * Verificar si el correo existe
    const existeEmail = async(correo = '') => {
      const emailExiste = await Usuario.findOne({correo});
      if(emailExiste){ // si existe este correo
        throw new Error(`El correo: ${correo}, ya existe`);
      }
    } 


    // * verificar que existe el usuario por id
    const existeUsuarioPorId = async(id) => {
      const existeUsuario = await Usuario.findById(id);
      if(!existeUsuario){ // si esto es null, osea no existe usuario por ese id mostramos el error
        throw new Error(`El id no existe: ${id}`);
      }
    } 
   


  module.exports = {
      esRoleValido,
      existeEmail,
      existeUsuarioPorId
  }