var instructions = require('../languages').instructions;
var tokenize = require('./tokenize');
module.exports = function(version, language, step, options) {
  var classes = options ? options.classes || [] : [];
  if (typeof step !== 'object') throw new Error('step must be an Object');
  if (!language) throw new Error('No language code provided');
  if (!Array.isArray(classes))
    throw new Error('classes must be an Array or undefined');

  var wayName;
  var name = step.name || '';
  var ref = (step.ref || '').split(';')[0];

  // Remove hacks from Mapbox Directions mixing ref into name
  if (name === step.ref) {
    // if both are the same we assume that there used to be an empty name, with the ref being filled in for it
    // we only need to retain the ref then
    name = '';
  }
  name = name.replace(' (' + step.ref + ')', '');

  // In attempt to avoid using the highway name of a way,
  // check and see if the step has a class which should signal
  // the ref should be used instead of the name.
  var wayMotorway = classes.indexOf('motorway') !== -1;

  if (name && ref && name !== ref && !wayMotorway) {
    var phrase =
      instructions[language][version].phrase['name and ref'] ||
      instructions.en[version].phrase['name and ref'];
    wayName = tokenize(
      version,
      language,
      phrase,
      {
        name: name,
        ref: ref
      },
      options
    );
  } else if (name && ref && wayMotorway && /\d/.test(ref)) {
    wayName = ref;
  } else if (!name && ref) {
    wayName = ref;
  } else {
    wayName = name;
  }

  return wayName;
};
