var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');
var instructionsFr = require('./instructions/fr.json');

module.exports = {
    get: function(language) {
        switch (language) {
        case 'en':
            return instructionsEn;
        case 'de':
            return instructionsDe;
        case 'fr':
            return instructionsFr;
        default:
            throw 'invalid language ' + language;
        }
    }
};
