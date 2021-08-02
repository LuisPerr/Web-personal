const Parametro = require('../models/parametros');

function getParametroByTipo(req, res) {
    const { par_tipo } = req.params;

    Parametro.find({ par_tipo: par_tipo }).then(parametro => {
        if (!parametro) {
            return res.status(404).send({ success: 0, message: 'No se encontro parametro' });
        } else {
            const { par_valor } = parametro[0];
            if (parametro.length > 0) {
                return res.status(200).send({ success: 1, message: 'Parametro encontrado', data: par_valor });
            } else {
                return res.status(404).send({ success: 0, message: 'No se encontro parametro' });
            };
        };
    });
};

module.exports = {
    getParametroByTipo
};