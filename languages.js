// Load all language files explicitly to allow integration
// with bundling tools like webpack and browserify
var instructionsDa = require('./languages/translations/da.json');
var instructionsDe = require('./languages/translations/de.json');
var instructionsEn = require('./languages/translations/en.json');
var instructionsEo = require('./languages/translations/eo.json');
var instructionsEs = require('./languages/translations/es.json');
var instructionsEsEs = require('./languages/translations/es-ES.json');
var instructionsFr = require('./languages/translations/fr.json');
var instructionsHe = require('./languages/translations/he.json');
var instructionsId = require('./languages/translations/id.json');
var instructionsIt = require('./languages/translations/it.json');
var instructionsNl = require('./languages/translations/nl.json');
var instructionsPl = require('./languages/translations/pl.json');
var instructionsPtBr = require('./languages/translations/pt-BR.json');
var instructionsPtPt = require('./languages/translations/pt-PT.json');
var instructionsRo = require('./languages/translations/ro.json');
var instructionsRu = require('./languages/translations/ru.json');
var instructionsSv = require('./languages/translations/sv.json');
var instructionsTr = require('./languages/translations/tr.json');
var instructionsUk = require('./languages/translations/uk.json');
var instructionsVi = require('./languages/translations/vi.json');
var instructionsZhHans = require('./languages/translations/zh-Hans.json');

// Load all grammar files
var grammarRu = require('./languages/grammar/ru.json');

// Load all abbreviations files
var abbreviationsBg = require('./languages/abbreviations/bg.json');
var abbreviationsCa = require('./languages/abbreviations/ca.json');
var abbreviationsDa = require('./languages/abbreviations/da.json');
var ebbreviationsDe = require('./languages/abbreviations/de.json');
var abbreviationsEn = require('./languages/abbreviations/en.json');
var abbreviationsEs = require('./languages/abbreviations/es.json');
var abbreviationsFr = require('./languages/abbreviations/fr.json');
var abbreviationsHe = require('./languages/abbreviations/he.json');
var abbreviationsHu = require('./languages/abbreviations/hu.json');
var abbreviationsLt = require('./languages/abbreviations/lt.json');
var abbreviationsNl = require('./languages/abbreviations/nl.json');
var abbreviationsRu = require('./languages/abbreviations/ru.json');
var abbreviationsSl = require('./languages/abbreviations/sl.json');
var abbreviationsSv = require('./languages/abbreviations/sv.json');
var abbreviationsUk = require('./languages/abbreviations/uk.json');
var abbreviationsVi = require('./languages/abbreviations/vi.json');

// Create a list of supported codes
var instructions = {
    'da': instructionsDa,
    'de': instructionsDe,
    'en': instructionsEn,
    'eo': instructionsEo,
    'es': instructionsEs,
    'es-ES': instructionsEsEs,
    'fr': instructionsFr,
    'he': instructionsHe,
    'id': instructionsId,
    'it': instructionsIt,
    'nl': instructionsNl,
    'pl': instructionsPl,
    'pt-BR': instructionsPtBr,
    'pt-PT': instructionsPtPt,
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

// Create list of supported abbrevations
var abbreviations = {
    'bg': abbreviationsBg,
    'ca': abbreviationsCa,
    'da': abbreviationsDa,
    'de': ebbreviationsDe,
    'en': abbreviationsEn,
    'es': abbreviationsEs,
    'fr': abbreviationsFr,
    'he': abbreviationsHe,
    'hu': abbreviationsHu,
    'lt': abbreviationsLt,
    'nl': abbreviationsNl,
    'ru': abbreviationsRu,
    'sl': abbreviationsSl,
    'sv': abbreviationsSv,
    'uk': abbreviationsUk,
    'vi': abbreviationsVi
};
module.exports = {
    supportedCodes: Object.keys(instructions),
    instructions: instructions,
    grammars: grammars,
    abbreviations: abbreviations
};
