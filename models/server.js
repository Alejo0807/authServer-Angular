const express = require('express');
const cors = require('cors');
const path = require('path')
const { dbConnection } = require('../db/config');
require('dotenv').config();


class Server {
    
    constructor() {
        this.app = express();

        this.port = process.env.PORT;

        this.path = {
            auth: '/api/auth',
        };
        
        //DB
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Parse body
        this.app.use(express.json());   
        
        //Directorio Público
        this.app.use(express.static('public'))
    }

    async connectDB() {
        await dbConnection()
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.get('*', (req, res) => {
            res.sendFile( path.resolve(__dirname, '../public/index.html'))
        })
    }

    listen() {
        this.app.listen(this.port, () => {
        console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }
}


module.exports = Server;