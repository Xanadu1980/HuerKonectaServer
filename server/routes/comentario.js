const express = require('express');
const Comentario = require('./../models/comentario');
const Publicacion = require('./../models/publicacion');
const app = express();
const path = require('path');
const fs = require('fs-extra');

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200', 'http://127.0.0.1:8080', 
    'http://localhost:8080','https://inversiones-jr.netlify.app'],
    credentials:true
}));

app.get('/comentarios', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Comentario.find(function(err, comentario) {
        if(err) res.send(500, err.message);
        console.log('GET /comentarios')  
        res.status(200).jsonp(comentario);
    });

});

app.get('/comentarios/part/:count/:idPublicacion', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Comentario.find(function(err, comentario) {
        if(err) res.send(500, err.message);

        var comentarioAux = [];

        comentario.reverse();

        var u = 0;
        for(var i = 0; i < parseInt(req.params.count); i++){
            if(comentario[i] !== undefined && comentario[i].idPublicacion == req.params.idPublicacion){
                comentarioAux[u] = comentario[i];
                u = u + 1;
            }
        }

        console.log(comentarioAux);

        console.log('GET /comentarios')  
        res.status(200).jsonp(comentarioAux);
    });

});

app.get("/comentarios/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Comentario.findById(req.params.id, function(err, comentario) {
        
        if(comentario !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /comentario/' + req.params.id);
            res.status(200).jsonp(comentario);
        }else{
            return res.status(400).jsonp({message: "La comentario no existe"});
        }
    });

});

app.post('/comentarios', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    dataOthers = { _id: req.body.idPublicacion };

    Publicacion.findOne(dataOthers, function(err, publicacion){
        if(err) res.send(500, err.message);
        
        if(publicacion !== null) {
            publicacion.cantidad_comentarios = publicacion.cantidad_comentarios + 1;

            publicacion.save(function(err){
                if(err) console.log(err);
            });
        }

        var comentario = new Comentario({
            descripcion:    req.body.descripcion,
            idPublicacion:       req.body.idPublicacion,
            idUser:       req.body.idUser,
            time:     req.body.time
        });
        
        comentario.save(function(err, comentario) {
            if(err) return res.send(500, err.message);
            res.status(200).jsonp(comentario);
        });
    });


});

app.put('/comentarios/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Comentario.findById(req.params.id, function(err, comentario) {
        
        if(comentario !== null){

            comentario.descripcion   = req.body.descripcion;
            comentario.time = req.body.time;

            comentario.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(comentario);
            });
        }else{
            return res.status(400).jsonp({message: "La comentario no existe"});
        }
    });

});

app.delete("/comentarios/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Comentario.findById(req.params.id, function(err, comentario) {
       if(comentario !== null){
        
            var dataOthers = { _id: comentario.idPublicacion };

            Publicacion.findOne(dataOthers, function(err, publicacion){
                if(err) res.send(500, err.message);
                
                if(publicacion !== null) {
                    publicacion.cantidad_comentarios = publicacion.cantidad_comentarios - 1;

                    publicacion.save(function(err){
                        if(err) console.log(err);
                    });
                }
            });
     
            comentario.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(comentario);
            })
            
        }else{
            return res.status(400).jsonp({message: "La comentario no existe"});
        }
    });



    

});

module.exports = app;