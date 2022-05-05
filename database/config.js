const mongoose = require('mongoose');

const dbConnection = async() => {  
    
    // es una bd donde yo no tengo el cotrol absoluto es bueno usar try and catch
    
    try {
       await mongoose.connect(process.env.MONGODB_CNN, {
           useNewUrlParser: true,
           useUnifiedTopology: true
       });
    } catch (error) {
        throw new Error('Error al iniciar la base de datos');
    }

    console.log('Base de datos online');

}



module.exports = {
    dbConnection
}