const express = require('express');
const Tarea = require('./../models/tarea');
const app = express();

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200',
            'http://127.0.0.1:4200', 
            'http://127.0.0.1:8080', 
            'http://localhost:8080'],
    credentials:true
}));

app.get('/tareas/', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tarea.find(function(err, tarea) {
        if(err) res.send(500, err.message);
        console.log('GET /tareas')  
        res.status(200).jsonp(tarea);
    });

});

app.get('/tareas/countByStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tarea.find(function(err, tarea) {
        if(err) res.send(500, err.message);
        console.log('GET /tareas')

        statusArray = [];
        statusJson = [];

        if(tarea.length > 0){
            for(var i = 0; i < tarea.length; i++){
                if(tarea[i].status !== undefined){
                    statusArray[i] = tarea[i].status; //Caracas
                }
            }
        }

        const filteredArray = statusArray.filter(function(ele , pos){
            return statusArray.indexOf(ele) == pos;
        }) 

        if(tarea.length > 0 && filteredArray.length > 0){
            for(var i=0; i < filteredArray.length; i++){
                contadorEstado = 0;

                for(var j=0; j < tarea.length; j++){
                    if(tarea[j].status == filteredArray[i] && tarea[j].status !== undefined){
                        contadorEstado = contadorEstado + 1;
                    }
                }

                statusJson.push({"name": filteredArray[i], "value": contadorEstado});
            }
        }

        if(err) res.status(500).jsonp(err.message);
        console.log('GET Cantidad de tareas')

        res.status(200).jsonp(statusJson);
    });

});

app.get('/tareas/cantidadPorStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tarea.find(function(err, tarea) {
        if(err) res.send(500, err.message);
        console.log('GET /tareas')

        contCompleted = 0;
        contInProgress = 0;
        contArchived = 0;
        contTodos = 0;

        for(var i = 0; i < tarea.length; i++){

            if(tarea[i] !== undefined && tarea[i].status == 'Hecho'){
                contCompleted = contCompleted + 1;
            }

            if(tarea[i] !== undefined && tarea[i].status == 'En progreso'){
                contInProgress = contInProgress + 1;
            }

            if(tarea[i] !== undefined && tarea[i].status == 'Archivado'){
                contArchived = contArchived + 1;
            }

            contTodos = contTodos + 1;
        }

        let data = {
            "cantidadHechos" : contCompleted,
            "cantidadEnProgreso" : contInProgress,
            "cantidadArchived" : contArchived,
            "todos" : contTodos
        };

        res.status(200).jsonp(data);
    });

});

app.get("/tareas/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Tarea.findById(req.params.id, function(err, tarea) {

        if(tarea !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /tarea/' + req.params.id);
            res.status(200).jsonp(tarea);
        }else{
            return res.status(400).jsonp({message: "La tarea no existe"});
        }
    });

});

app.post('/tareas/part/:count', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tarea.find(function(err, tarea) {
        if(err) res.send(500, err.message);

        var tareaAux = [];
        tarea.reverse();
        u = 0;

        for(var i = 0; i < tarea.length; i++){
            if(req.body.status !== ''){
                if(tarea[i] !== undefined && tarea[i].status == req.body.status){
                    tareaAux[u] = tarea[i];
                    u = u + 1;
                }
            }else{
                if(tarea[i] !== undefined){
                    tareaAux[u] = tarea[i];
                    u = u + 1;
                }
            }

            if(u == req.params.count){
                i = tarea.length;
            }
        }

        console.log(tareaAux);

        console.log('GET /tareas')  
        res.status(200).jsonp(tareaAux);
    });

});

app.put('/tareas/status/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tarea.findById(req.params.id, function(err, tarea) {

        if(tarea !== null){
            tarea.status  = req.body.status;

            tarea.save(function(err) {
                if(err) return res.status(500).jsonp(err.message);
                  res.status(200).jsonp(tarea);
            });
        }else{
            return res.status(400).jsonp({message: "Esa tarea no existe"});
        }
    });

});

app.post('/tareas', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    var tarea = new Tarea({
        nombre:    req.body.nombre,
        descripcion:     req.body.descripcion,
        idActividad:    req.body.idActividad,
        idUser:       req.body.idUser,
        createBy:       req.body.createBy,
        time:       req.body.time,
        status:     req.body.status
    });

    tarea.save(function(err, tarea) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(tarea);
    });
});

app.put('/tareas/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tarea.findById(req.params.id, function(err, tarea) {

        if(tarea !== null){
            tarea.nombre  = req.body.nombre;
            tarea.descripcion  = req.body.descripcion;
            tarea.idActividad  = req.body.idActividad;
            tarea.idUser  = req.body.idUser;
            tarea.time  = req.body.time;
            tarea.status = req.body.status;

            tarea.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(tarea);
            });
        }else{
            return res.status(400).jsonp({message: "Esta tarea no existe"});
        }
        
    });

});

app.delete("/tareas/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tarea.findById(req.params.id, function(err, tarea) {
        if(tarea !== null){
                tarea.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(tarea);
            })
        }else{
            return res.status(400).jsonp({message: "Esta tarea no existe"});
        }
    });

});

module.exports = app;