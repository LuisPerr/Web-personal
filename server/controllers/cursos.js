const Curso = require('../models/cursos');
const fs = require('fs');
const saveImages = require('../utils/saveImages');

function addCursos(req, res) {
    const { nombre, descripcion, saveUrl, imageUrl, siteUrl, active, imageBase64 } = req.body;
    let curso = new Curso();

    curso.nombre = nombre;
    curso.descripcion = descripcion;
    curso.imageUrl = imageUrl;
    curso.siteUrl = siteUrl;
    curso.active = active;

    fs.writeFile(`${saveUrl}`, imageBase64, 'base64', function (err) {
        if (err) {
            console.log('Error', err);
        };
    });

    curso.save((err, CursoCreate) => {
        if (err) {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!CursoCreate) {
                return res.status(404).send({ success: 0, message: 'Error al crear el curso' });
            } else {
                res.status(200).send({ success: 1, message: 'Se creo el curso con éxtio' });
            };
        };
    });
};


function allCursos(req, res) {
    Curso.find().sort({ nombre: 'asc' })
        .exec((err, cursos) => {
            if (err) {
                return res.status(500).send({ success: 0, message: 'Error del servidor' });
            } else {
                if (!cursos) {
                    res.status(404).send({ success: 0, message: 'No se encontraron cursos' });
                } else {
                    res.status(200).send({ success: 1, message: 'Cursos encontrados', data: cursos });
                };
            }
        });
};

async function updateCurso(req, res) {
    let { saveImage } = req.body;
    let params = req.params;
    let cursoData = {};

    if (saveImage) {
        resImage = await saveImages.saveImage(req.body.imageBase64, req.body.saveUrl);
        if (resImage.success) {
            cursoData = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                imageUrl: req.body.imageUrl,
                siteUrl: req.body.siteUrl
            };
        } else {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        };
    } else {
        cursoData = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            siteUrl: req.body.siteUrl
        };
    };

    Curso.findByIdAndUpdate({ _id: params.idCurso }, cursoData, (err, resultCurso) => {
        if (err) {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!resultCurso) {
                return res.status(404).send({ success: 0, message: 'No se encontro el curso' });
            } else {
                res.status(200).send({ success: 1, message: 'Curso actualizado con exito' });
            };
        };
    });
};

function deleteCurso(req, res) {
    const { idCurso } = req.params;

    Curso.findByIdAndDelete({ _id: idCurso }, (error, dataResult) => {
        if (error) {
            res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!dataResult) {
                res.status(404).send({ success: 0, message: 'No se encontro el curso' });
            } else {
                res.status(200).send({ success: 1, message: 'Se elimino el curso con exito' });
            };
        };
    });
};

function activeCurso(req, res) {
    let { active } = req.body;
    let params = req.params;

    Curso.findByIdAndUpdate({ _id: params.idCurso }, { active: active }, (err, resultCurso) => {
        if (err) {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!resultCurso) {
                return res.status(404).send({ success: 0, message: 'No se encontro el curso' });
            } else {
                res.status(200).send({ success: 1, message: 'Curso actualizado con exito' });
            };
        };
    });
};

module.exports = {
    addCursos,
    allCursos,
    updateCurso,
    deleteCurso,
    activeCurso
};