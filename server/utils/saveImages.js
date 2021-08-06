const fs = require('fs');

exports.saveImage = function (b64, saveUrl) {
    return new Promise(resolve => {
        fs.writeFile(`${saveUrl}`, b64, 'base64', function (err) {
            if (err) {
                resolve({ success: false });
            } else {
                resolve({ success: true });
            };
        });
    });
};