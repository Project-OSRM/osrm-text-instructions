var instructions = require('../languages').instructions;
module.exports = function(version, language, number) {
  // Transform numbers to their translated ordinalized value
  if (!language) throw new Error('No language code provided');

  return (
    instructions[language][version].constants.ordinalize[number.toString()] ||
    ''
  );
};
