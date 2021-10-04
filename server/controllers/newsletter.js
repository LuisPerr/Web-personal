const { param } = require('../app');
const Newsletter = require('../models/newsletter');

function suscribeEmail(req, res, next) {
    let newsletter = new Newsletter();
    const email = req.params.email;

    if (!email) {
        res.status(404).send({ success: 0, message: 'El correo es obligatorio' });
    } else {

        newsletter.email = email.toLowerCase();
        newsletter.save((err, userStored) => {
            if (err) {
                res.status(500).send({ success: 0, message: 'El Correo ya se habia registrados' });
            } else {
                if (!userStored) {
                    res.status(404).send({ success: 0, message: 'Error al guardar correo' });
                } else {
                    res.status(200).send({ success: 1, message: 'Correo guardado con éxito', data: userStored });
                }
            };
        });
    };
};

module.exports = {
    suscribeEmail
};