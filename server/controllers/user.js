const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt');
const User = require("../models/user");
const fs = require('fs');
const path = require('path');

function singUp(req, res) {
    const user = new User();

    const { name, lastName, email, password, repeatPassword } = req.body;
    user.name = name;
    user.lastName = lastName;
    user.email = email.toLowerCase();
    user.role = 'Admin';
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ success: 0, message: "Las contraseñas son obligatorias" })
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

function uploadAvatar(req, res) {
    const params = req.params;
    User.findById({ _id: params.idUsuario }, (err, userData) => {
        if (err) {
            res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!userData) {
                res.status(404).send({ success: 0, message: 'No se encontro ningun usuario' });
            } else {
                let user = userData;

                if (req.files) {
                    let filePath = req.files.avatar.path;
                    let fileName = filePath.split('\\')[2];
                    let fileExt = fileName.split(".")[1];

                    if (fileExt !== 'png' && fileExt !== 'jpg') {
                        res.status(400).send({ success: 0, message: 'La extension de la imagen no es valida, solo se permiten "png" y "jpg".' });
                    } else {
                        user.avatar = fileName;
                        User.findByIdAndUpdate({ _id: params.idUsuario }, user, (error, userRes) => {
                            if (error) {
                                res.status(500).send({ success: 0, message: 'Error del servidor' });
                            } else {
                                if (!userRes) {
                                    res.status(404).send({ success: 0, message: 'Usuario no encontrado' });
                                } else {
                                    res.status(200).send({ success: 1, message: 'Se guardo la imagen con éxito', data: fileName });
                                };
                            };
                        });
                    };
                };
            };
        };
    });
};

function getUrlAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = `./uploads/avatar/${avatarName}`;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({ success: 0, message: 'No se encontro el avatar' });
        } else {
            res.sendFile(path.resolve(filePath));
        };
    });
};

async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const { idUsuario } = req.params;
    if (userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ success: 0, message: 'Error al encriptar la contraseña.' });
            } else {
                userData.password = hash;
            };
        });
    };

    User.findByIdAndUpdate({ _id: idUsuario }, userData, (error, userRes) => {
        if (error) {
            res.status(500).send({ success: 0, message: 'Error del servidor.' });
        } else {
            if (!userRes) {
                res.status(404).send({ success: 0, message: 'No se encotro el usuario.' });
            } else {
                res.status(200).send({ success: 1, message: 'El usuario se actualizo con éxito.' });
            };
        };
    });
};

function activeUser(req, res) {
    const { idUsuario } = req.params;
    const { active } = req.body;
    let text = active ? 'Activo' : 'Inactivo';

    User.findByIdAndUpdate({ _id: idUsuario }, { active: active }, (error, result) => {
        if (error) {
            res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!result) {
                res.status(404).send({ success: 0, message: 'No se encotro el usuario.' });
            } else {
                res.status(200).send({ success: 1, message: `El usuario se ${text} con éxito.` });
            };
        };
    });
};

function deleteUser(req, res) {
    const { idUsuario } = req.params;

    User.findByIdAndDelete({ _id: idUsuario }, (error, dataResult) => {
        if (error) {
            res.status(500).send({ success: 0, message: 'Error del servidor' });
        } else {
            if (!dataResult) {
                res.status(404).send({ success: 0, message: 'No se encontro el usuario' });
            } else {
                res.status(200).send({ success: 1, message: 'Se elimino el usuario con exito' });
            };
        };
    });
};

function createUser(req, res) {
    const user = new User();
    const { name, lastName, email, role, password } = req.body;
    user.name = name;
    user.lastName = lastName;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        return res.status(500).send({ success: 0, message: 'La contraseña es obligatoria' });
    } else {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ success: 0, message: 'Error al encriptar la contraseña' });
            } else {
                if (!hash) {
                    res.status(500).send({ success: 0, message: 'Error al encriptar la contraseña' });
                } else {
                    user.params = hash;
                };
            };
        });
    };

    user.save((err, result) => {
        if (err) {
            res.status(500).send({ success: 0, message: 'El usuario ya existe' });
        } else {
            if (!result) {
                res.status(500).send({ success: 0, message: 'Error al crear el usuario.' });
            } else {
                res.status(200).send({ success: 1, message: 'Se creo el usuario con exito', data: result });
            };
        };
    });

};

module.exports = {
    singUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getUrlAvatar,
    updateUser,
    activeUser,
    deleteUser,
    createUser
};