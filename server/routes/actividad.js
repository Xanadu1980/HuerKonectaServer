const express = require('express');
const Actividad = require('./../models/actividad');
const Tarea = require('./../models/tarea');
const app = express();

// Configurando el Cors en el servidor.
var cors = require('cors');
app.use(cors({
    origin:['http://localhost:4200',
            'http://127.0.0.1:4200', 
            'http://127.0.0.1:8080', 
            'http://localhost:8080',
            'https://inversiones-jr.netlify.app'],
    credentials:true
}));

app.get('/actividades', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Actividad.find(function(err, actividad) {
        if(err) res.send(500, err.message);
        console.log('GET /actividades')  
        res.status(200).jsonp(actividad);
    });

});

app.get('/actividades/countByStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Actividad.find(function(err, actividad) {
        if(err) res.send(500, err.message);
        console.log('GET /actividades')

        statusArray = [];
        statusJson = [];

        if(actividad.length > 0){
            for(var i = 0; i < actividad.length; i++){
                if(actividad[i].status !== undefined){
                    statusArray[i] = actividad[i].status; //Caracas
                }
            }
        }

        const filteredArray = statusArray.filter(function(ele , pos){
            return statusArray.indexOf(ele) == pos;
        }) 

        if(actividad.length > 0 && filteredArray.length > 0){
            for(var i=0; i < filteredArray.length; i++){
                contadorEstado = 0;

                for(var j=0; j < actividad.length; j++){
                    if(actividad[j].status == filteredArray[i] && actividad[j].status !== undefined){
                        contadorEstado = contadorEstado + 1;
                    }
                }

                statusJson.push({"name": filteredArray[i], "value": contadorEstado});
            }
        }

        if(err) res.status(500).jsonp(err.message);
        console.log('GET Cantidad de actividades')

        res.status(200).jsonp(statusJson);
    });

});

app.get('/actividades/cantidadPorStatus', function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Actividad.find(function(err, actividad) {
        if(err) res.send(500, err.message);
        console.log('GET /actividades')

        contCompleted = 0;
        contInProgress = 0;
        contArchived = 0;
        contTodos = 0;

        for(var i = 0; i < actividad.length; i++){

            if(actividad[i] !== undefined && actividad[i].status == 'Hecho'){
                contCompleted = contCompleted + 1;
            }

            if(actividad[i] !== undefined && actividad[i].status == 'En progreso'){
                contInProgress = contInProgress + 1;
            }

            if(actividad[i] !== undefined && actividad[i].status == 'Archivado'){
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

app.get("/actividades/TopActivitiesByTask", function(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
    Actividad.find(function(err, actividad) {

        statusJson = [];
        statusJsonTop = [];

        if(actividad.length > 0){
            Tarea.find(function(err, tarea){

                if(tarea.length > 0){
                    for(var j = 0; j < actividad.length; j++){
                        contadorEstado = 0;
                        for(var i = 0; i < tarea.length; i++){
                            if(tarea[i].idActividad == actividad[j]._id){
                                contadorEstado = contadorEstado + 1;
                            }
                        }

                        statusJson.push({"name": actividad[j].nombre, "value": contadorEstado});
                    }
                }

                statusJson.sort((a,b) => (b.value > a.value) ? 1 : ((a.value > b.value) ? -1 : 0));

                for(var i = 0; i < 5; i++){
                    if(statusJson[i] !== undefined){
                        statusJsonTop.push(statusJson[i]);
                    }
                }

                if(err) res.status(500).jsonp(err.message);
                console.log('GET Cantidad de actividades')

                res.status(200).jsonp(statusJsonTop);

            });
        }
    });

});

app.get("/actividades/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Actividad.findById(req.params.id, function(err, actividad) {

        if(actividad !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /actividad/' + req.params.id);
            res.status(200).jsonp(actividad);
        }else{
            return res.status(400).jsonp({message: "Esa actividad no existe"});
        }

    });

});

app.post('/actividades/part/:count', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Actividad.find(function(err, actividad) {
        if(err) res.send(500, err.message);

        var actividadAux = [];
        actividad.reverse();
        u = 0;

        for(var i = 0; i < actividad.length; i++){
            if(req.body.status !== ''){
                if(actividad[i] !== undefined && actividad[i].status == req.body.status){
                    actividadAux[u] = actividad[i];
                    u = u + 1;
                }
            }else{
                if(actividad[i] !== undefined){
                    actividadAux[u] = actividad[i];
                    u = u + 1;
                }
            }

            if(u == req.params.count){
                i = actividad.length;
            }
        }

        console.log(actividadAux);

        console.log('GET /actividades')  
        res.status(200).jsonp(actividadAux);
    });

});

app.post('/actividades', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    var actividad = new Actividad({
        nombre:    req.body.nombre,
        descripcion:     req.body.descripcion,
        tipo:    req.body.tipo,
        fecha:       req.body.fecha,
        startTime:    req.body.startTime,
        endTime:       req.body.endTime,
        createBy:       req.body.createBy,
        time:       req.body.time,
        status:     req.body.status
    });

    actividad.save(function(err, actividad) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(actividad);
    });
});

app.put('/actividades/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Actividad.findById(req.params.id, function(err, actividad) {

        if(actividad !== null){
            actividad.nombre  = req.body.nombre;
            actividad.descripcion  = req.body.descripcion;
            actividad.tipo  = req.body.tipo;
            actividad.fecha  = req.body.fecha;
            actividad.startTime  = req.body.startTime;
            actividad.endTime  = req.body.endTime;
            actividad.time  = req.body.time;
            actividad.status  = req.body.status;

            actividad.save(function(err) {
                if(err) return res.status(500).jsonp(err.message);
                  res.status(200).jsonp(actividad);
            });
        }else{
            return res.status(400).jsonp({message: "Esa actividad no existe"});
        }
    });

});

app.put('/actividades/status/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Actividad.findById(req.params.id, function(err, actividad) {

        if(actividad !== null){
            actividad.status  = req.body.status;

            actividad.save(function(err) {
                if(err) return res.status(500).jsonp(err.message);
                  res.status(200).jsonp(actividad);
            });
        }else{
            return res.status(400).jsonp({message: "Esa actividad no existe"});
        }
    });

});

app.delete("/actividades/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Actividad.findById(req.params.id, function(err, actividad) {

        if(actividad !== null){
            actividad.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(actividad);
            })
        }else{
            return res.status(400).jsonp({message: "Esa actividad no existe"});
        }
    });

});

module.exports = app;