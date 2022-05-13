const express = require('express');
const Usuario = require('./../models/usuario');
const Publicacion = require('./../models/publicacion');
const Comentario = require('./../models/comentario');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:8080', 
    'http://localhost:8080','https://inversiones-jr.netlify.app'],
    credentials:true
}));

cloudinary.config({ 
  cloud_name: 'inversiones-jr', 
  api_key: '365829617555839', 
  api_secret: 'WwBaMDCZ_1B0SXtAw6hrEMF55eM' 
});

app.get("/users/", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
    Usuario.find(function(err, usuario) {
        if(err) res.send(500, err.message);
        console.log('GET /usuarios')  
      res.status(200).jsonp(usuario);
    });

});

app.get("/users/part/:count", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
    Usuario.find(function(err, usuario) {

        if(err) res.send(500, err.message);

        var usuarioAux = [];

        for(var i = 0; i < parseInt(req.params.count); i++){
            if(usuario[i] !== undefined){
                usuarioAux[i] = usuario[i];
            }
        }

        console.log('GET /usuarios')  
        res.status(200).jsonp(usuarioAux);
    });

});

app.get("/users/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Usuario.findById(req.params.id, function(err, usuario) {
        
        if(usuario !== null){
            if(err) return res.send(500, err.message);

            console.log(usuario.password);

            console.log('GET /usuario/' + req.params.id);
            res.status(200).jsonp(usuario);
        }else{
            return res.status(400).jsonp({message: "El usuario no existe"});
        }

    });

});

app.put('/users/username/:username', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    data = { username: req.params.username };

    Usuario.findOne(data, function(err, usuario) {

        if(usuario !== null) {
            usuario.nombre   = req.body.nombre;
            usuario.apellido = req.body.apellido;
            usuario.username = req.body.username;
            usuario.email = req.body.email;
            usuario.telefono = req.body.telefono;
            usuario.puesto = req.body.puesto;

            usuario.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(usuario);
            });
        }else{
            return res.status(400).jsonp({message: "No se encontraron los datos del usuario"})
        }
    });

    dataOthers = { idUser: req.params.username };

    Publicacion.find(dataOthers, function(err, publicaciones){

        console.log("Cantidad Publicaciones: " + publicaciones.length);

        if(publicaciones.length > 0){
            for(var i = 0; i < publicaciones.length; i++){
                publicaciones[i].idUser = req.body.username;

                console.log(publicaciones[i]);

                publicaciones[i].save(function(err){
                    if(err) console.log(err);
                });
            }
        }
    });

    Comentario.find(dataOthers, function(err, comentarios){

        console.log("Cantidad Comentarios: " + comentarios.length);

        if(comentarios.length > 0){
            for(var i = 0; i < comentarios.length; i++){
                comentarios[i].idUser = req.body.username;

                console.log(comentarios[i]);

                comentarios[i].save(function(err){
                    if(err) console.log(err);
                });
            }
        }

    });

});

app.put('/users/role/:username', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    data = { username: req.params.username };

    Usuario.findOne(data, function(err, usuario) {

        if(usuario !== null){
            usuario.role   = req.body.role;

            usuario.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(usuario);
            });
        }else{
            return res.status(400).jsonp({message: "Este usuario no existe"});
        }
    });

});

app.put('/users/password/:username', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed


    let body = req.body;
    data = { username: req.params.username };

    Usuario.findOne(data, function(err, usuario) {
        if(usuario !== null){

            // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
            if (! bcrypt.compareSync(body.password, usuario.password)){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "La contraseña colocada es incorrecta."
                    }
                });
            }

            usuario.password = bcrypt.hashSync(body.passwordNew, 10);

            usuario.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(usuario);
            });
        }else{
            return res.status(400).jsonp({message: "Este usuario no existe"});
        }
    });

});

app.put('/users/imagen/:username', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    data = { username: req.params.username };

    Usuario.findOne(data, function(err, usuario) {

        if(usuario !== null){

            if(usuario.avatar_public_id !== ''){
                cloudinary.uploader.destroy(usuario.avatar_public_id, function(error, result) { 
                    console.log(result, error)
                });
            }
                
            usuario.avatar   = req.body.avatar;
            usuario.avatar_public_id   = req.body.avatar_public_id;

            usuario.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(usuario);
            });
        }else{
            return res.status(400).jsonp({message: "Este usuario no existe"});
        }
    });

});

app.get("/users/username/:username", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    console.log(req.params.username);

    data = { username: req.params.username };
    
    Usuario.findOne(data, function(err, usuario) {
        if(usuario !== null){    
            if(err) return res.send(500, err.message);
            
            console.log('GET /usuario/' + req.params.username);
            res.status(200).jsonp(usuario);
        }else{
            return res.status(400).jsonp({message: "Este usuario no existe"});
        }
    });

});

app.delete("/users/username/:username", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    data = { username: req.params.username };
    
    Usuario.findOne(data, function(err, usuario) {
        if(err) return res.send(500, err.message);

        if(usuario !== null){        

            if(usuario.avatar_public_id !== ''){
                cloudinary.uploader.destroy(usuario.avatar_public_id, function(error, result) { 
                    console.log(result, error)
                });
            }

            usuario.remove(function(err) {
                if(err) return res.send(500, err.message);
                res.status(200).jsonp({message: "Delete Successful", 
                                          usuario});
            })
        }else{
            return res.status(400).jsonp({message: "Este usuario no existe"});
        }
    });

    dataOthers = { idUser: req.params.username };
    
    Publicacion.find(dataOthers, function(err, publicaciones){

        console.log("Cantidad Publicaciones: " + publicaciones.length);

        if(publicaciones.length > 0){
            for(var i = 0; i < publicaciones.length; i++){

                if(publicaciones[i].imagen_public_id !== ''){
                    cloudinary.uploader.destroy(publicaciones[i].imagen_public_id, function(error, result) { 
                        console.log(result, error)
                    });
                }

                publicaciones[i].remove(function(err){
                    if(err) console.log(err);
                });
            }
        }
    });

    Comentario.find(dataOthers, function(err, comentarios){

        console.log("Cantidad comentarios: " + comentarios.length);

        if(comentarios.length > 0){
            for(var i = 0; i < comentarios.length; i++){
                comentarios[i].remove(function(err){
                    if(err) console.log(err);
                });
            }
        }
    });

});

app.delete("/users/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Usuario.findById(req.params.id, function(err, usuario) {

        if(usuario !== null){
            usuario.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp({message: "Delete Successful", 
                                          usuario});
            })
        }
    });

});

module.exports = app;
