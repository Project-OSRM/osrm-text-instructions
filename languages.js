// Load all language files explicitly to allow integration
// with bundling tools like webpack and browserify
var instructionsDe = require('./languages/translations/de.json');
var instructionsEn = require('./languages/translations/en.json');
var instructionsEo = require('./languages/translations/eo.json');
var instructionsEs = require('./languages/translations/es.json');
var instructionsEsEs = require('./languages/translations/es-ES.json');
var instructionsFr = require('./languages/translations/fr.json');
var instructionsId = require('./languages/translations/id.json');
var instructionsIt = require('./languages/translations/it.json');
var instructionsNl = require('./languages/translations/nl.json');
var instructionsPl = require('./languages/translations/pl.json');
var instructionsPtBr = require('./languages/translations/pt-BR.json');
var instructionsRo = require('./languages/translations/ro.json');
var instructionsRu = require('./languages/translations/ru.json');
var instructionsSv = require('./languages/translations/sv.json');
var instructionsTr = require('./languages/translations/tr.json');
var instructionsUk = require('./languages/translations/uk.json');
var instructionsVi = require('./languages/translations/vi.json');
var instructionsZhHans = require('./languages/translations/zh-Hans.json');

// Load all grammar files
var grammarRu = require('./languages/grammar/ru.json');

// Create a list of supported codes
var instructions = {
    'de': instructionsDe,
    'en': instructionsEn,
    'eo': instructionsEo,
    'es': instructionsEs,
    'es-ES': instructionsEsEs,
    'fr': instructionsFr,
    'id': instructionsId,
    'it': instructionsIt,
    'nl': instructionsNl,
    'pl': instructionsPl,
    'pt-BR': instructionsPtBr,
    'ro': instructionsRo,
    'ru': instructionsRu,
    'sv': instructionsSv,
    'tr': instructionsTr,
    'uk': instructionsUk,
    'vi': instructionsVi,
    'zh-Hans': instructionsZhHans
};

// Create list of supported grammar
var grammars = {
    'ru': grammarRu
};

function parseLanguageIntoCodes (language) {
    var match = language.match(/(\w\w)(?:-(\w\w\w\w))?(?:-(\w\w))?/i);
    var locale = [];
    if (match[1]) {
        match[1] = match[1].toLowerCase();
        locale.push(match[1]);
    }
    if (match[2]) {
        match[2] = match[2][0].toUpperCase() + match[2].substring(1).toLowerCase();
        locale.push(match[2]);
    }
    if (match[3]) {
        match[3] = match[3].toUpperCase();
        locale.push(match[3]);
    }

    return {
        locale: locale.join('-'),
        language: match[1],
        script: match[2],
        region: match[3]
    };
}

module.exports = {
    supportedCodes: Object.keys(instructions),
    parsedSupportedCodes: Object.keys(instructions).map(function(language) {
        return parseLanguageIntoCodes(language);
    }),
    instructions: instructions,
    grammars: grammars,
    parseLanguageIntoCodes: parseLanguageIntoCodes
};
