const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let tareaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre no debe estar vacio'],
    },
    descripcion: {
        type: String,
    },
    idActividad: {
        type: String,
        required: [true, 'Esta tarea debe estar relacionada con una actividad'],
    },
    idUser: {
        type: String,
        required: [true, "Esta tarea debe estar relacionada con un usuario"],
    },
    createBy: {
        type: String,
    },
    time: {
        type: String,
    },
    status: {
        type: String,
        required: [true, "Esta tarea debe contener un status"]
    }
});

module.exports = mongoose.model('Tarea', tareaSchema)