const setLanguage = require('./set_language');
const validateStep = require('./validate_step');

module.exports = function(langCode, step, opts) {
  if (langCode === undefined) throw new Error('language must be provided');
  validateStep(step);
  opts = opts || {};

  const language = setLanguage(langCode);

  var possibleTokens = pickTokensFromStep(step);
  var desiredTokens = JSON.parse(JSON.stringify(possibleTokens));

  Object.keys(opts.overrides || {}).forEach(key => {
    if (opts.overrides[key] === null) {
      delete desiredTokens[key];
    } else {
      desiredTokens[key] = opts.overrides[key];
      possibleTokens[key] = opts.overrides[key];
    }
  });

  if (opts.onToken) {
    Object.keys(possibleTokens).forEach(function(key) {
      var baseValue = desiredTokens[key] || possibleTokens[key];

      var changed = opts.onToken(key, baseValue);
      if (changed === null) {
        delete desiredTokens[key];
      } else {
        desiredTokens[key] =
          desiredTokens[key] === undefined ? undefined : changed || baseValue;
        possibleTokens[key] = changed || baseValue;
      }
    });
  }

  var type = step.maneuver.type;
  var modifier = step.maneuver.modifier;

  return buildPhrase(
    [language, this.version, type, modifier],
    desiredTokens,
    possibleTokens
  );
};

function pickTokensFromStep(step) {
  return {
    type: step.maneuver.type,
    turn: step.maneuver.modifier,
    name: step.name
  };
}

function buildPhrase(keyPath, desiredTokens, possibleTokens) {
  return keyPath.join(' - ') + JSON.stringify([desiredTokens, possibleTokens]);
}
