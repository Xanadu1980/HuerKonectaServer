const express = require('express');
const Tramite = require('./../models/tramites');
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

app.get('/tramites', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tramite.find(function(err, tramite) {
        if(err) res.send(500, err.message);
        console.log('GET /tramites')  
        res.status(200).jsonp(tramite);
    });

});

app.get('/tramites/countByStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tramite.find(function(err, tramite) {
        if(err) res.send(500, err.message);
        console.log('GET /tramites')

        statusArray = [];
        statusJson = [];

        if(tramite.length > 0){
            for(var i = 0; i < tramite.length; i++){
                if(tramite[i].status !== undefined){
                    statusArray[i] = tramite[i].status; //Caracas
                }
            }
        }

        const filteredArray = statusArray.filter(function(ele , pos){
            return statusArray.indexOf(ele) == pos;
        }) 

        if(tramite.length > 0 && filteredArray.length > 0){
            for(var i=0; i < filteredArray.length; i++){
                contadorEstado = 0;

                for(var j=0; j < tramite.length; j++){
                    if(tramite[j].status == filteredArray[i] && tramite[j].status !== undefined){
                        contadorEstado = contadorEstado + 1;
                    }
                }

                statusJson.push({"name": filteredArray[i], "value": contadorEstado});
            }
        }

        if(err) res.status(500).jsonp(err.message);
        console.log('GET Cantidad de tramites')

        res.status(200).jsonp(statusJson);
    });

});

app.get('/tramites/cantidadPorStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tramite.find(function(err, tramite) {
        if(err) res.send(500, err.message);
        console.log('GET /tramites')

        contCompleted = 0;
        contInProgress = 0;
        contArchived = 0;
        contTodos = 0;

        for(var i = 0; i < tramite.length; i++){

            if(tramite[i] !== undefined && tramite[i].status == 'Hecho'){
                contCompleted = contCompleted + 1;
            }

            if(tramite[i] !== undefined && tramite[i].status == 'En progreso'){
                contInProgress = contInProgress + 1;
            }

            if(tramite[i] !== undefined && tramite[i].status == 'Archivado'){
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

app.get("/tramites/TopActivitiesByTask", function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
    Tramite.find(function(err, tramite) {

        statusJson = [];
        statusJsonTop = [];

        if(tramite.length > 0){
            Tarea.find(function(err, tarea){

                if(tarea.length > 0){
                    for(var j = 0; j < tramite.length; j++){
                        contadorEstado = 0;
                        for(var i = 0; i < tarea.length; i++){
                            if(tarea[i].idtramite == tramite[j]._id){
                                contadorEstado = contadorEstado + 1;
                            }
                        }

                        statusJson.push({"name": tramite[j].nombre, "value": contadorEstado});
                    }
                }

                statusJson.sort((a,b) => (b.value > a.value) ? 1 : ((a.value > b.value) ? -1 : 0));

                for(var i = 0; i < 5; i++){
                    if(statusJson[i] !== undefined){
                        statusJsonTop.push(statusJson[i]);
                    }
                }

                if(err) res.status(500).jsonp(err.message);
                console.log('GET Cantidad de tramites')

                res.status(200).jsonp(statusJsonTop);

            });
        }
    });

});

app.get("/tramites/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Tramite.findById(req.params.id, function(err, tramite) {

        if(tramite !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /tramite/' + req.params.id);
            res.status(200).jsonp(tramite);
        }else{
            return res.status(400).jsonp({message: "Esa tramite no existe"});
        }

    });

});

app.post('/tramites/part/:count', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Tramite.find(function(err, tramite) {
        if(err) res.send(500, err.message);

        var tramiteAux = [];
        tramite.reverse();
        u = 0;

        for(var i = 0; i < tramite.length; i++){
            if(req.body.status !== ''){
                if(tramite[i] !== undefined && tramite[i].status == req.body.status){
                    tramiteAux[u] = tramite[i];
                    u = u + 1;
                }
            }else{
                if(tramite[i] !== undefined){
                    tramiteAux[u] = tramite[i];
                    u = u + 1;
                }
            }

            if(u == req.params.count){
                i = tramite.length;
            }
        }

        console.log(tramiteAux);

        console.log('GET /tramites')  
        res.status(200).jsonp(tramiteAux);
    });

});

app.post('/tramites', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    var tramite = new Tramite({
        nombre:    req.body.nombre,
        descripcion:     req.body.descripcion,
        tipo:    req.body.tipo,
        fecha:       req.body.fecha,
        startTime:    req.body.startTime,
        endTime:       req.body.endTime,
        createBy:       req.body.createBy,
        time:       req.body.time,
        status:     req.body.status,
        idUser: req.body.idUser
    });

    tramite.save(function(err, tramite) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(tramite);
    });
});

app.put('/tramites/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tramite.findById(req.params.id, function(err, tramite) {

        if(tramite !== null){
            tramite.nombre  = req.body.nombre;
            tramite.descripcion  = req.body.descripcion;
            tramite.tipo  = req.body.tipo;
            tramite.fecha  = req.body.fecha;
            tramite.startTime  = req.body.startTime;
            tramite.endTime  = req.body.endTime;
            tramite.time  = req.body.time;
            tramite.status  = req.body.status;
            tramite.idUser  = req.body.idUser;

            tramite.save(function(err) {
                if(err) return res.status(500).jsonp(err.message);
                  res.status(200).jsonp(tramite);
            });
        }else{
            return res.status(400).jsonp({message: "Esa tramite no existe"});
        }
    });

});

app.put('/tramites/status/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tramite.findById(req.params.id, function(err, tramite) {

        if(tramite !== null){
            tramite.status  = req.body.status;

            tramite.save(function(err) {
                if(err) return res.status(500).jsonp(err.message);
                  res.status(200).jsonp(tramite);
            });
        }else{
            return res.status(400).jsonp({message: "Esa tramite no existe"});
        }
    });

});

app.delete("/tramites/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Tramite.findById(req.params.id, function(err, tramite) {

        if(tramite !== null){
            tramite.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(tramite);
            })
        }else{
            return res.status(400).jsonp({message: "Esa tramite no existe"});
        }
    });

});

module.exports = app;