const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let publicacionSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion no debe estar vacia'],
    },
    idUser: {
        type: String,
        required: [true, "Esta publicacion debe estar relacionada con el usuario"],
    },
    imagen: {
        type: String,
    },
    imagen_public_id: {
        type: String,
    },
    time:{
        type: String,
    },
    cantidad_comentarios:{
        type: Number
    }
});

module.exports = mongoose.model('Publicacion', publicacionSchema)