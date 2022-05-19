const express = require('express');
const Partner = require('./../models/partners');
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

app.get('/partners/', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Partner.find(function(err, partner) {
        if(err) res.send(500, err.message);
        console.log('GET /partners')  
        res.status(200).jsonp(partner);
    });

});

app.get("/partners/:id", function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    Partner.findById(req.params.id, function(err, partner) {

        if(partner !== null){
            if(err) return res.send(500, err.message);
            console.log('GET /partner/' + req.params.id);
            res.status(200).jsonp(partner);
        }else{
            return res.status(400).jsonp({message: "La partner no existe"});
        }
    });

});

app.get('/partners/part/:count', function (req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    Partner.find(function(err, partner) {
        if(err) res.send(500, err.message);

        var partnerAux = [];

        partner.reverse();

        for(var i = 0; i < parseInt(req.params.count); i++){
            if(partner[i] !== undefined){
                partnerAux[i] = partner[i];
            }
        }

        console.log(partnerAux);

        console.log('GET /partners')  
        res.status(200).jsonp(partnerAux);
    });

});

app.post('/partners', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    console.log('POST');
    console.log(req.body);

    var partner = new Partner({
        description:    req.body.description,
        email:     req.body.email,
        name:    req.body.name,
        phone:       req.body.phone,
    });

    partner.save(function(err, partner) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(partner);
    });
});

app.put('/partners/:id', function(req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Partner.findById(req.params.id, function(err, partner) {

        if(partner !== null){
            partner.description  = req.body.description;
            partner.name  = req.body.name;
            partner.email  = req.body.email;
            partner.phone  = req.body.phone;

            partner.save(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(partner);
            });
        }else{
            return res.status(400).jsonp({message: "Esta partner no existe"});
        }
        
    });

});

app.delete("/partners/:id", function (req, res){

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.header('Access-Control-Allow-Credentials', true); // If needed

    Partner.findById(req.params.id, function(err, partner) {
        if(partner !== null){
                partner.remove(function(err) {
                if(err) return res.send(500, err.message);
                  res.status(200).jsonp(partner);
            })
        }else{
            return res.status(400).jsonp({message: "Esta partner no existe"});
        }
    });

});

module.exports = app;