const express = require('express');
const CourseController = require('../controllers/courses');
const md_auth = require('../middleware/autheticated');

const api = express.Router();

api.post('/add-course/', [md_auth.ensureAuth], CourseController.addCourse);

module.exports = api;