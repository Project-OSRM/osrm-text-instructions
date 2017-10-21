var validation = {
  'maneuver.type': { values: ['turn'], types: ['string'] },
  'maneuver.modifier': { values: ['left', 'right'] },
  name: { types: ['string', 'undefined'] }
};

module.exports = function(step) {
  if (step === undefined) throw new Error('step must be provided');
  if (Array.isArray(step)) throw new Error('only one step can be provided');

  Object.keys(validation).forEach(function(key) {
    var path = key.split('.');
    var value = path.reduce(function(m, k, i) {
      if (typeof m !== 'object') {
        var before = path.slice(0, i).join('.');
        throw new Error(`Step is missing required attribute ${before}`);
      }
      return m[k];
    }, step);

    var valid = validation[key];
    if (valid.types && valid.types.indexOf(typeof value) === -1)
      throw new Error(`step ${key} is an invalid type: ${typeof value}`);
    if (valid.values && valid.values.indexOf(value) === -1)
      throw new Error(`step ${key} is an invalid value: ${value}`);
  });
};
