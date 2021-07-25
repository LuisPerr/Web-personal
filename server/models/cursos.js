const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CursosSchema = Schema({
    nombre: String,
    descripcion: String,
    imageUrl: String,
    siteUrl: String,
    active: Boolean
});

module.exports = mongoose.model('Cursos', CursosSchema);