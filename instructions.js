var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');

module.exports = {
    get: function(_language) {
        var language = _language || 'en';
        switch (language) {
        case 'en':
            return instructionsEn;
        case 'de':
            return instructionsDe;
        default:
            return instructionsEn;
        }
    }
};
