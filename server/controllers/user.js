const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt');
const User = require("../models/user");

function singUp(req, res) {
    const user = new User();

    const { name, lastName, email, password, repeatPassword } = req.body;
    user.name = name;
    user.lastName = lastName;
    user.email = email.toLowerCase();
    user.role = 'Admin';
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ success: 0, message: "Las contraseñas con obligatorias" })
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ success: 0, message: "Las contraseñas no coinciden" })
        } else {
            bcrypt.hash(password, null, null, (err, hash) => {
                if (err) {
                    res.status(500).send({ success: 0, message: "Error al encriptar la contraseña" });
                } else {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) {
                            res.status(500).send({ success: 0, message: 'El usuario ya existe' });
                        } else {
                            if (!userStored) {
                                res.status(404).send({ success: 0, message: 'Error al guardar el usuario' });
                            } else {
                                res.status(200).send({ success: 1, message: 'Usuario creado con exito', user: userStored });
                            }
                        };
                    });
                };
            });
        };
    };
};

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!userStored) {
                res.status(404).send({ success: 0, message: 'Usuario no encontrado' });
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({ success: 0, message: 'Error del servidor' });
                    } else {
                        if (!check) {
                            res.status(404).send({ success: 0, message: 'Usuario no encontrado' });
                        } else {
                            if (!userStored.active) {
                                res.status(200).send({ success: 1, message: 'El usuario no esta activo' });
                            } else {
                                res.status(200).send({
                                    success: 1,
                                    accessToken: jwt.createAccessToken(userStored),
                                    refreshToken: jwt.createRefreshToken(userStored),
                                    message: 'Usuario logeado'
                                });
                            };
                        };
                    };
                });
            };
        };
    });
};

function getUsers(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({ success: 0, message: 'No se encontraron usuarios' });
        } else {
            res.status(200).send({ success: 1, message: 'Usuarios encontrados', data: users });
        };
    });
};

function getUsersActive(req, res) {
    const { active } = req.query;

    User.find({ active: active }).then(users => {
        if (!users) {
            res.status(404).send({ success: 0, message: 'No se encontraron usuarios' });
        } else {
            if (users.length > 0) {
                res.status(200).send({ success: 1, message: 'Usuarios encontrados', data: users });
            } else {
                res.status(200).send({ success: 0, message: 'Usuarios no encontrados' });
            };
        };
    });
};

module.exports = {
    singUp,
    signIn,
    getUsers,
    getUsersActive
};