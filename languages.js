// Create a list of supported codes
var supportedCodes = [
    'de',
    'en',
    'es',
    'fr',
    'id',
    'nl',
    'ru',
    'sv',
    'vi',
    'zh-Hans'
];

module.exports = {
    get: function(codes) {
        // Loads translation files for only supported and user requested codes
        var languages = {};
        codes.forEach(function(code) {
            if (supportedCodes.indexOf(code) === -1) {
                throw 'Unsupported language code: ' + code;
            } else {
                languages[code] = require('./languages/translations/' + code + '.json');
            }
        });

        return languages;
    },
    supportedCodes: supportedCodes
};
