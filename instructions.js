var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');
var instructionsNl = require('./instructions/nl.json');

module.exports = {
    get: function(language) {
        switch (language) {
        case 'en':
            return instructionsEn;
        case 'de':
            return instructionsDe;
        case 'nl':
            return instructionsNl;
        default:
            throw 'invalid language ' + language;
        }
    }
};
