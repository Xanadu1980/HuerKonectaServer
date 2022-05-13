const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let partnerSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripcion no debe estar vacia'],
    },
    email: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "Este partner debe tener un nombre"],
    },
    phone: {
        type: String,
    }
});

module.exports = mongoose.model('Partner', partnerSchema)