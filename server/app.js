const express = require('express');

const app = express();
const { API_VERSION } = require('./config');

//Carga de rutas
const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');
const menuRoutes = require('./routers/menu');
const cursosRoutes = require('./routers/cursos');
const parametrosRoutes = require('./routers/parametros');
const newsletterRoutes = require('./routers/newsletter');
const coursesRoutes = require('./routers/courses');

app.use(express.urlencoded({ limit: '250mb', extended: true }))
app.use(express.json({ limit: '250mb' }));
app.use(express({ limit: '250mb' }));

// configuracion del header de HTTP;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});


//Rutas basicas
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, cursosRoutes);
app.use(`/api/${API_VERSION}`, parametrosRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);
app.use(`/api/${API_VERSION}`, coursesRoutes);

module.exports = app;