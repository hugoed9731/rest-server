const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({ //Schema para definir ese objeto

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // identificar quien crea esta nueva categoriá
        required: true
    }

});



// SOBREESCRIBIENDO METODOS - SIEMPRE TIENE QUE SER UNA FUNCION NORMAL NO UNA FUNCION DE FLECHA
CategoriaSchema.methods.toJSON = function() {
    // ! extraer lo que no vamos a ocupar de nuestra categoria
    const {__v, estado, ...data} = this.toObject(); // genera una instacia

    return data; // cuando se grabe esto retorno el usuario
}




module.exports = model( 'Categoria', CategoriaSchema);