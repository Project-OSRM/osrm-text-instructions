// Load all language files excplicitely to allow integration
// with bundling tools like webpack and browserify
var instructionsDe = require('./instructions/de.json');
var instructionsEn = require('./instructions/en.json');
var instructionsFr = require('./instructions/fr.json');
var instructionsNl = require('./instructions/nl.json');
var instructionsVi = require('./instructions/vi.json');
var instructionsZhHans = require('./instructions/zh-Hans.json');

// Table to match tag to required language files
// A tag can redirect to another tag via the language tag as string value
var table = {
    'de': instructionsDe,
    'en': instructionsEn,
    'fr': instructionsFr,
    'nl': instructionsNl,
    'vi': instructionsVi,
    'zh-Hans': instructionsZhHans,
    'zh': 'zh-Hans'
};

module.exports = {
    table: table,
    get: function(language) {
        var value = this.table[language];
        if (!value) {
            throw 'invalid language ' + language;
        }
        if (value.constructor === String) {
            // redirect to other tag
            // this may result in stack exceeded errors if cyclic loading
            return this.get(value);
        }

        return value;
    }
};
