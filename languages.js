// Load all language files excplicitely to allow integration
// with bundling tools like webpack and browserify
var instructionsDe = require('./languages/translations/de.json');
var instructionsEn = require('./languages/translations/en.json');
var instructionsEs = require('./languages/translations/es.json');
var instructionsFr = require('./languages/translations/fr.json');
var instructionsId = require('./languages/translations/id.json');
var instructionsNl = require('./languages/translations/nl.json');
var instructionsRu = require('./languages/translations/ru.json');
var instructionsSv = require('./languages/translations/sv.json');
var instructionsVi = require('./languages/translations/vi.json');
var instructionsZhHans = require('./languages/translations/zh-Hans.json');


// Create a list of supported codes
var instructions = {
    'de': instructionsDe,
    'en': instructionsEn,
    'es': instructionsEs,
    'fr': instructionsFr,
    'id': instructionsId,
    'nl': instructionsNl,
    'ru': instructionsRu,
    'sv': instructionsSv,
    'vi': instructionsVi,
    'zh-Hans': instructionsZhHans
};

module.exports = {
    supportedCodes: Object.keys(instructions),
    instructions: instructions
};
