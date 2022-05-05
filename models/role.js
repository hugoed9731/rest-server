const { Schema, model } = require('mongoose');

const RoleSchema = Schema({ //Schema para definir ese objeto
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});



module.exports = model( 'Role', RoleSchema);