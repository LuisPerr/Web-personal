const express = require('express');
const ParametroController = require('../controllers/parametros');
const md_auth = require('../middleware/autheticated');

const api = express.Router();

api.get("/param_tipo/:par_tipo", ParametroController.getParametroByTipo);

module.exports = api;