const Role = require('../models/role');
const {Usuario, Categoria, Producto } = require('../models');


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

    // * EXISTE CATEGORIA
    const existeCategoriaPorId = async(id) => {
      const existeCategoria = await Categoria.findById(id);
      if(!existeCategoria){ // si esto es null, osea no existe usuario por ese id mostramos el error
        throw new Error(`El id no existe: ${id}`);
      }
    } 

    
    // * EXISTE PRODUCTOS
    const existeProductoPorId = async(id) => {
      const existeProducto = await Producto.findById(id);
      if(!existeProducto){ // si esto es null, osea no existe usuario por ese id mostramos el error
        throw new Error(`El id no existe: ${id}`);
      }
    } 

    // * Validar colecciones permitidad

    const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

      // ! verificar que esta coleccion existe en el arreglo
      const incluida = colecciones.includes( coleccion );
      if(!incluida) { // si no esta incluida. debemos de dispara el error siguiente
        throw new Error(`La coleccion ${coleccion} no es permitidad, ${colecciones}`)
      }

      return true;

    }

  module.exports = {
      esRoleValido,
      existeEmail,
      existeUsuarioPorId,
      existeCategoriaPorId,
      existeProductoPorId,
      coleccionesPermitidas
  }