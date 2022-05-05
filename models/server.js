const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // * CONECTAR A BD
        this.conectarDB();

        // Middelware  - son funciones que va añadir otra funcionalidad a mi web server
        // funcion que siempre se va a ejecutar cuando levantemos nuestro servidor
        this.middelwares();

        // Rutas
        this.routes();
        // esto dispara el metodo y el metodo configura mis rutas
    }

    async conectarDB(){
        await dbConnection();
    }


    middelwares() {

        // CORS
        this.app.use(cors());

        // Parse y lectura del body
        // enviamos infomación entre el front y el back mediante JSON
        this.app.use(express.json());

        // directorio Público
        this.app.use(express.static('public'));
        // ! indica a express que por
        // ! defecto se debe renderizar el contenido de la carpeta "public" en la raíz de nuestro proyecto
        // ! por tanto ignora al app.get('/');

    }


    routes() {
    //    utilizamos un middleware al cual le ponemos ciertas rutas
    // este es el path que vamos a ocupar apartir de ahora
        this.app.use(this.usuariosPath, require('../routes/user'));
    }

    listen() {

        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });

    }
}

module.exports = Server;