const capitalizeFirstLetter = require('./capitalize_first_letter');
const grammarize = require('./grammarize');
const instructions = require('../languages').instructions;

module.exports = function(version, language, instruction, tokens, options) {
  if (!language) throw new Error('No language code provided');
  // Keep this function context to use in inline function below (no arrow functions in ES4)
  var startedWithToken = false;
  var output = instruction
    .replace(/\{(\w+)(?::(\w+))?\}/g, function(token, tag, grammar, offset) {
      var value = tokens[tag];

      // Return unknown token unchanged
      if (typeof value === 'undefined') {
        return token;
      }

      value = grammarize(version, language, value, grammar);

      // If this token appears at the beginning of the instruction, capitalize it.
      if (offset === 0 && instructions[language].meta.capitalizeFirstLetter) {
        startedWithToken = true;
        value = capitalizeFirstLetter(language, value);
      }

      if (options && options.formatToken) {
        value = options.formatToken(tag, value);
      }

      return value;
    })
    .replace(/ {2}/g, ' '); // remove excess spaces

  if (!startedWithToken && instructions[language].meta.capitalizeFirstLetter) {
    return capitalizeFirstLetter(language, output);
  }

  return output;
};
