const express = require('express');
const MenuController = require('../controllers/menu');
const md_auth = require('../middleware/autheticated');

const api = express.Router();

api.post('/add-menu', [md_auth.ensureAuth], MenuController.addMenu);
api.get('/all-menu', MenuController.allMenus);
api.post('/all-menu-active', [md_auth.ensureAuth], MenuController.allMenusByActive);
api.put('/update-menu/:idMenu', [md_auth.ensureAuth], MenuController.updateMenu)

module.exports = api;