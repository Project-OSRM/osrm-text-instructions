var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');
var instructionsFr = require('./instructions/fr.json');
var instructionsNl = require('./instructions/nl.json');
var instructionsZhHans = require('./instructions/zh-Hans.json');

module.exports = {
    get: function(language) {
        switch (language) {
        case 'en':
            return instructionsEn;
        case 'de':
            return instructionsDe;
        case 'fr':
            return instructionsFr;
        case 'nl':
            return instructionsNl;
        case 'zh':
        case 'zh-Hans':
            return instructionsZhHans;
        default:
            throw 'invalid language ' + language;
        }
    }
};
