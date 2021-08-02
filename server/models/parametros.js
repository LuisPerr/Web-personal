const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParametroSchema = Schema({
    par_tipo: String,
    par_valor: String,
    par_descripcion: String,
});

module.exports = mongoose.model('Parametro', ParametroSchema);