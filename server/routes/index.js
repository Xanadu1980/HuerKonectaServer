const express = require('express')
const app = express()

app.use(require('./login'));
app.use(require('./register'));
app.use(require('./user'));
app.use(require('./publicacion'));
app.use(require('./comentario'));
app.use(require('./mail'));
app.use(require('./actividad'));
app.use(require('./tarea'));
app.use(require('./partners'));
app.use(require('./tramites'));

module.exports = app;