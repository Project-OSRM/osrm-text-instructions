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
    // If the language is not found, try a little harder
    var splitLocale = language.toLowerCase().split('-');
    var languageCode = splitLocale[0];
    var scriptCode = false;
    var countryCode = false;

    /**
     Documentation on how the language tag is being split: https://en.wikipedia.org/wiki/IETF_language_tag#Syntax_of_language_tags

     Example: zh-Hant-TW
     language code: zh
     script code: Hant
     country code: TW

     Example: en-US
     language code: en
     country code: US
    */

    if (splitLocale.length === 2 && splitLocale[1].length === 4) {
        scriptCode = splitLocale[1];
    } else if (splitLocale.length === 2 && splitLocale[1].length === 2) {
        countryCode = splitLocale[1];
    } else if (splitLocale.length === 3) {
        scriptCode = splitLocale[1];
        countryCode = splitLocale[2];
    }

    return {
        locale: language,
        languageCode: languageCode,
        scriptCode: scriptCode,
        countryCode: countryCode
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
