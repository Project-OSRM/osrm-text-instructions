var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');

module.exports = {
    get: function(language) {
        switch (language) {
        case 'en':
            return instructionsEn;
        case 'de':
            return instructionsDe;
        default:
            throw 'invalid language ' + language;
        }
    }
};
