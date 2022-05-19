const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');
const app = express();

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:8080', 
    'http://localhost:8080'],
    credentials:true
}));

app.post('/login', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    let body = req.body;
    let data;

    console.log(body.email);

    if(body.email !== undefined){
        console.log('Es un email');
        data = { email: body.email };
    }else{
        console.log('Es un username');
        data = { username: body.username };
    }

    Usuario.findOne(data, (erro, usuarioDB)=>{
        if (erro) {
            return res.status(500).json({
                ok: false,
                err: erro
            })
        }

        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encontro el email o username."
                }
            })
        } 

        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        if (! bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Contraseña incorrecta."
                }
            });
        }

        // Genera el token de autenticación
        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED_AUTENTICACION, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        })

    })

});

module.exports = app;

