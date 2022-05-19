const express = require('express');
const Publicacion = require('./../models/publicacion');
const Comentario = require('./../models/comentario');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const cloudinary = require('cloudinary').v2;

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:8080', 
    'http://localhost:8080'],
    credentials:true
}));

cloudinary.config({ 
  cloud_name: 'inversiones-jr', 
  api_key: '365829617555839', 
  api_secret: 'WwBaMDCZ_1B0SXtAw6hrEMF55eM' 
});

app.get('/publicaciones', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Publicacion.find(function(err, publicacion) {
        if(err) res.send(500, err.message);
        console.log('GET /publicaciones')  
        res.status(200).jsonp(publicacion);
    });

});

app.get('/publicaciones/part/:count', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Publicacion.find(function(err, publicacion) {
        if(err) res.send(500, err.message);

        var publicacionAux = [];

        publicacion.reverse();

        for(var i = 0; i < parseInt(req.params.count); i++){
            if(publicacion[i] !== undefined){
                publicacionAux[i] = publicacion[i];
            }
        }

        console.log(publicacionAux);

        console.log('GET /publicaciones')  
        res.status(200).jsonp(publicacionAux);
    });

});

app.get("/publicaciones/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Publicacion.findById(req.params.id, function(err, publicacion) {
        
        if(publicacion !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /publicacion/' + req.params.id);
            res.status(200).jsonp(publicacion);
        }else{
            return res.status(400).jsonp({message: "La publicacion no existe"});
        }
    });

});

app.post('/publicaciones', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    var publicacion = new Publicacion({
        descripcion:    req.body.descripcion,
        idUser:       req.body.idUser,
        imagen: req.body.imagen,
        imagen_public_id: req.body.imagen_public_id,
        time:     req.body.time,
        cantidad_comentarios: 0
    });

    publicacion.save(function(err, publicacion) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(publicacion);
    });
});

app.put('/publicaciones/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Publicacion.findById(req.params.id, function(err, publicacion) {
        
        if(publicacion !== null){

            if(publicacion.imagen_public_id !== ''){
                cloudinary.uploader.destroy(publicacion.imagen_public_id, function(error, result) { 
                    console.log(result, error)
                });
            }

            publicacion.descripcion   = req.body.descripcion;
            publicacion.time = req.body.time;
            publicacion.imagen = req.body.imagen;
            publicacion.imagen_public_id = req.body.imagen_public_id;

            publicacion.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(publicacion);
            });
        }else{
            return res.status(400).jsonp({message: "La publicacion no existe"});
        }
    });

});

app.put('/publicaciones/withoutimage/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Publicacion.findById(req.params.id, function(err, publicacion) {
        
        if(publicacion !== null){

            publicacion.descripcion   = req.body.descripcion;
            publicacion.time = req.body.time;

            publicacion.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(publicacion);
            });
        }else{
            return res.status(400).jsonp({message: "La publicacion no existe"});
        }
    });

});

app.delete("/publicaciones/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Publicacion.findById(req.params.id, function(err, publicacion) {

        if(publicacion !== null){

            if(publicacion.imagen_public_id !== ''){
                cloudinary.uploader.destroy(publicacion.imagen_public_id, function(error, result) { 
                    console.log(result, error)
                });
            }

            publicacion.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(publicacion);
            })

        }else{
            return res.status(400).jsonp({message: "La publicacion no existe"});
        }
    });

    dataOthers = { idPublicacion: req.params.id };

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

module.exports = app;