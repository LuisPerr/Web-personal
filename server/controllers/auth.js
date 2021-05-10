const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../models/user');

function willExpiredToken(token) {
    const { exp } = jwt.decodeToken(token);
    const currentDate = moment().unix();

    if (currentDate > exp) {
        return true;
    } else {
        return false;
    };
};

function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;
    const isTokenExpired = willExpiredToken(refreshToken);
    if (isTokenExpired) {
        res.status(404).send({ success: 0, message: 'El refreshToken ha expirado' });
    } else {
        const { id } = jwt.decodeToken(refreshToken);
        User.findOne({ _id: id }, (err, userStored) => {
            if (err) {
                res.status(500).send({ success: 1, message: 'Error del servidor' });
            } else {
                if (!userStored) {
                    res.status(404).send({ success: 0, message: 'Usuario no encontrado' });
                } else {
                    res.status(200).send({
                        success: 1,
                        message: 'Token refrescado',
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    });
                };
            };
        });
    };
};

module.exports = {
    refreshAccessToken
};