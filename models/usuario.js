
const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});


// SOBREESCRIBIENDO METODOS - SIEMPRE TIENE QUE SER UNA FUNCION NORMAL NO UNA FUNCION DE FLECHA
UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject(); // genera una instacia

    // * transformar el _id por uid
    usuario.uid = _id;

    return usuario; // cuando se grabe esto retorno el usuario
}


module.exports = model('Usuarios', UsuarioSchema);
