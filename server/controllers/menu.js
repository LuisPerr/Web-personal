const menu = require('../models/menu');
const Menu = require('../models/menu');

function addMenu(req, res) {
    const { title, url, order, active } = req.body;
    const menu = new Menu();

    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err, menuCreate) => {
        if (err) {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!menuCreate) {
                return res.status(404).send({ success: 0, message: 'Error al crear el menu' });
            } else {
                res.status(200).send({ success: 1, message: 'Se creo el menu con éxtio' });
            };
        };
    });
};

function allMenus(req, res) {
    Menu.find().sort({ order: 'asc' })
        .exec((err, menus) => {
            if (err) {
                return res.status(500).send({ success: 0, message: 'Error del servidor' });
            } else {
                if (!menus) {
                    res.status(404).send({ success: 0, message: 'No se encontraron menus' });
                } else {
                    res.status(200).send({ success: 1, message: 'Menus encontrados', data: menus });
                };
            }
        });
};

function allMenusByActive(req, res) {
    const { active } = req.body;
    Menu.find({ active: active }).then(menus => {
        if (!menus) {
            return res.status(404).send({ success: 0, message: 'No se encontraron menus' });
        } else {
            if (menus.length > 0) {
                return res.status(200).send({ success: 1, message: 'Menus encontrados', data: menus });
            } else {
                return res.status(404).send({ success: 0, message: 'No se encontraron menus' });
            };
        };
    });
};

function updateMenu(req, res) {
    let menuData = req.body;
    let params = req.params;
    Menu.findByIdAndUpdate({ _id: params.idMenu }, menuData, (err, resultMenu) => {
        if (err) {
            return res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!resultMenu) {
                return res.status(404).send({ success: 0, message: 'No se encontro el menu' });
            } else {
                res.status(200).send({ success: 1, message: 'Menu actualizado con exito' });
            };
        };
    });
};

module.exports = {
    addMenu,
    allMenus,
    allMenusByActive,
    updateMenu
};
