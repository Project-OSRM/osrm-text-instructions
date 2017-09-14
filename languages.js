// Load all language files excplicitely to allow integration
// with bundling tools like webpack and browserify
var instructionsDe = require('./languages/translations/de.json');
var instructionsEn = require('./languages/translations/en.json');
var instructionsEs = require('./languages/translations/es.json');
var instructionsFr = require('./languages/translations/fr.json');
var instructionsId = require('./languages/translations/id.json');
var instructionsIt = require('./languages/translations/it.json');
var instructionsNl = require('./languages/translations/nl.json');
var instructionsPl = require('./languages/translations/pl.json');
var instructionsPtBr = require('./languages/translations/pt-BR.json');
var instructionsRo = require('./languages/translations/ro.json');
var instructionsRu = require('./languages/translations/ru.json');
var instructionsSv = require('./languages/translations/sv.json');
var instructionsUk = require('./languages/translations/uk.json');
var instructionsVi = require('./languages/translations/vi.json');
var instructionsZhHans = require('./languages/translations/zh-Hans.json');


// Create a list of supported codes
var instructions = {
    'de': instructionsDe,
    'en': instructionsEn,
    'es': instructionsEs,
    'fr': instructionsFr,
    'id': instructionsId,
    'it': instructionsIt,
    'nl': instructionsNl,
    'pl': instructionsPl,
    'pt-BR': instructionsPtBr,
    'ro': instructionsRo,
    'ru': instructionsRu,
    'sv': instructionsSv,
    'uk': instructionsUk,
    'vi': instructionsVi,
    'zh-Hans': instructionsZhHans
};

module.exports = {
    supportedCodes: Object.keys(instructions),
    instructions: instructions
};
