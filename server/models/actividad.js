const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let actividadSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre no debe estar vacio'],
    },
    descripcion: {
        type: String,
    },
    tipo: {
        type: String,
        required: [true, 'El tipo no debe estar vacio'],
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha no debe estar vacia'],
    },
    startTime: {
        type: String,
        required: [true, "El tiempo de inicio no debe estar vacio"],
    },
    endTime: {
        type: String,
        required: [true, "El tiempo final no debe estar vacio"],
    },
    createBy: {
        type: String,
    },
    time: {
        type: String
    },
    status: {
        type: String,
        required: [true, "Esta tarea debe contener un status"]
    }
});

module.exports = mongoose.model('Actividad', actividadSchema)