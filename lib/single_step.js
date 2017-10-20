const setLanguage = require('./set_language');

module.exports = function(langCode, step, overrides) {
  const language = setLanguage(langCode);

  var tokens = pickTokensFromStep(step);

  Object.keys(overrides).forEach(key => {
    if (overrides[key] === null) {
      delete tokens[key];
    } else {
      tokens[key] = overrides[key];
    }
  });

  var type = step.maneuver.type;
  var modifier = step.maneuver.modifier;

  return buildPhrase([language, this.version, type, modifier], tokens);
};

function pickTokensFromStep(step) {
  return {};
}

function findPhrase(keyPath, tokens) {
  return keyPath.join(' - ');
}
