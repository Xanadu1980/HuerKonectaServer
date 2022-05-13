const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('./../models/usuario');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const transporter = require('./../config/mailer');

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:8080', 
    'http://localhost:8080','https://inversiones-jr.netlify.app'],
    credentials:true
}));

 
app.post('/register', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    let body = req.body;

    let { nombre, apellido, username, email, telefono, 
          password, role, puesto, avatar, 
          avatar_public_id } = body;

    if(nombre == 'undefined' || apellido == 'undefined'){
        return res.status(400).json({
            ok: false,
            err: {
                message: "El nombre y apellido son necesarios para registrarte"
            }
        })
    }

    if(username == 'undefined'){
        return res.status(400).json({
            ok: false,
            err: {
                message: "Necesitas el nombre de usuario para registrarte"
            }
        })
    }

    if(email == 'undefined'){
        return res.status(400).json({
            ok: false,
            err: {
                message: "Necesitas el correo electronico para registrarte"
            }
        })
    }

    if(password == 'undefined'){
        return res.status(400).json({
            ok: false,
            err: {
                message: "Debes colocar una contraseña"
            }
        })
    }

    // send mail with defined transport object
    let info = transporter.sendMail({
                from: '"Forgot Password" <joseeli12345@gmail.com>', 
                to: email, 
                subject: "Creacion de Cuenta",
                html: `
                    <p>Estimado(a) `+email+`</p>
                    <p> Gracias por registrarse en nuestro sistema de Inversiones JR. </p>
                    <p> Su nueva contraseña es la siguiente: `+password+` </p>
                    <p> Saludos cordiales. </p>
                `
    });

    let usuario = new Usuario({
      nombre,
      apellido,
      username,
      email,
      telefono,
      password: bcrypt.hashSync(password, 10),
      role,
      avatar,
      avatar_public_id,
      puesto
    });

    usuario.save((err, usuarioDB) => {

        console.log(usuarioDB)

      if (err) {
          return res.status(400).json({
              ok: false,
              err,
          });
      }

      res.json({
          ok: true,
          usuario: usuarioDB
      });

    })
});

module.exports = app;

