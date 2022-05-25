const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // * rutas
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }

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

        // * MIDDELWARE PARA MANEJAR EL FILEUPLOAD - O LA CARGA DE ARCHIVOS
            this.app.use(fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/',
                createParentPath: true // crea una carpeta por defecto si no trae una indicada en cuestion de textos
            }));

    }


    routes() {
    //    utilizamos un middleware al cual le ponemos ciertas rutas
    // este es el path que vamos a ocupar apartir de ahora
        this.app.use(this.paths.auth, require('../routes/auth')); 
        this.app.use(this.paths.buscar, require('../routes/buscar')); 
        this.app.use(this.paths.categorias, require('../routes/categorias')); 
        this.app.use(this.paths.productos, require('../routes/productos')); 
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {

        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });

    }
}

module.exports = Server;