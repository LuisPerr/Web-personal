const express = require('express');
const cursosController = require('../controllers/cursos');
const md_auth = require('../middleware/autheticated');

const api = express.Router();

api.post('/add-cursos', [md_auth.ensureAuth], cursosController.addCursos);
api.get('/all-cursos', cursosController.allCursos);
api.put('/update-curso/:idCurso', [md_auth.ensureAuth], cursosController.updateCurso);
api.delete("/delete-curso/:idCurso", [md_auth.ensureAuth], cursosController.deleteCurso);

module.exports = api;