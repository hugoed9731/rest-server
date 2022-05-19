const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({ //Schema para definir ese objeto

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
    usuario: { // * USUARIO QUIEN ESTA CREANDO EL PRODUCTO
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // identificar quien crea esta nueva categoriá
        required: true
    },
    precio: {
        type: Number,   
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {type: Boolean, default: true}

});



// SOBREESCRIBIENDO METODOS - SIEMPRE TIENE QUE SER UNA FUNCION NORMAL NO UNA FUNCION DE FLECHA
ProductoSchema.methods.toJSON = function() {
    // ! extraer lo que no vamos a ocupar de nuestra categoria
    const {__v, estado, ...data} = this.toObject(); // genera una instacia
    // no mando version, no mando estado, y todo lo demas ...data si lo quiero regresar

    return data; // cuando se grabe esto retorno el usuario
}




module.exports = model( 'Producto', ProductoSchema);