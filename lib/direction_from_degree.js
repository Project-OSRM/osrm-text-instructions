var instructions = require('../languages').instructions;
module.exports = function(version, language, degree) {
  // Transform degrees to their translated compass direction
  if (!language) throw new Error('No language code provided');
  if (!degree && degree !== 0) {
    // step had no bearing_after degree, ignoring
    return '';
  } else if (degree >= 0 && degree <= 20) {
    return instructions[language][version].constants.direction.north;
  } else if (degree > 20 && degree < 70) {
    return instructions[language][version].constants.direction.northeast;
  } else if (degree >= 70 && degree <= 110) {
    return instructions[language][version].constants.direction.east;
  } else if (degree > 110 && degree < 160) {
    return instructions[language][version].constants.direction.southeast;
  } else if (degree >= 160 && degree <= 200) {
    return instructions[language][version].constants.direction.south;
  } else if (degree > 200 && degree < 250) {
    return instructions[language][version].constants.direction.southwest;
  } else if (degree >= 250 && degree <= 290) {
    return instructions[language][version].constants.direction.west;
  } else if (degree > 290 && degree < 340) {
    return instructions[language][version].constants.direction.northwest;
  } else if (degree >= 340 && degree <= 360) {
    return instructions[language][version].constants.direction.north;
  } else {
    throw new Error('Degree ' + degree + ' invalid');
  }
};
