const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const transporter = require('./../config/mailer');
const bcrypt = require('bcrypt');
const Usuario = require('./../models/usuario');

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:8080', 
	'http://localhost:8080'],
    credentials:true
}));

app.post('/mail/forgotPassword', function(req, res){

	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    let body = req.body;
    let { email, subject } = body;

    data = { email };

    Usuario.findOne(data, function(err, usuario) {
        if(usuario !== null) {
        	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	        passwordNew = Math.random().toString(36).substring(0,7); 

            usuario.password = bcrypt.hashSync(passwordNew, 10);

            usuario.save(function(err) {
                if(err) return res.send(500, err.message);
            });
        }else{
            return res.status(400).jsonp({message: "No se encontro el correo electronico del usuario"})
        }

        // send mail with defined transport object
		let info = transporter.sendMail({
			    from: '"Forgot Password" <joseeli12345@gmail.com>', 
			    to: email, 
			    subject: subject,
			    html: `
			    	<p>Estimado(a) `+email+`</p>
			    	<p> Se ha enviado un correo de recuperación de contraseña. Si usted no envió este mensaje puede omitirlo. </p>
			    	<p> Su nueva contraseña es la siguiente: `+passwordNew+` </p>
			    	<p> Saludos cordiales. </p>
			    `
		});

		res.json({
		      ok: true,
		      message: "Su contraseña ha sido cambiada, revise su correo"
		});
    });

});

app.post('/mail/form', function(req, res){

	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    let body = req.body;
    let { emailTo, subject, message } = body;

    // send mail with defined transport object
	let info = transporter.sendMail({
		    from: subject + ' <joseeli12345@gmail.com>', 
		    to: emailTo, 
		    subject: subject,
		    html: message
	});

	res.json({
	      ok: true,
	      message: 'Correo enviado satisfactoriamente'
	});

});

module.exports = app;