const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let comentarioSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion no debe estar vacia'],
    },
    idUser: {
        type: String,
        required: [true, "Esta publicacion debe estar relacionada con el usuario"],
    },
    idPublicacion: {
        type: String,
        required: [true, "Esta publicacion debe estar relacionada con su publicacion"],
    },
    time:{
        type: String,
    }
});

module.exports = mongoose.model('Comentario', comentarioSchema)