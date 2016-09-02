var instructions = require('./instructions.json');

// Assertions
if (Object !== instructions.constructor) throw "instructions must be object";

var validLevels = [ 'high' ];

module.exports = {
    compile: function(step, version, level, cb) {
        // TODO: Validations

        var err;
        var type = step.maneuver.type;
        var modifier = step.maneuver.modifier;

        if(!instructions[version]) { return cb(new Error("Invalid version")); }
        if(!type) { return cb(new Error("Missing step maneuver type")); }
        if(!modifier) { return cb(new Error('Missing step maneuver modifier')); }
        if(validLevels.indexOf(level) < 0) { return cb(new Error('Invalid level ' + level)); }

        if(!instructions[version][type]) {
          // if we have an unknown type, then use `turn` as default
          type = 'turn';
        }
        if(!instructions[version][type][modifier]) {
          return cb(new Error('Invalid step maneuver type-modifier combination ' + type + ' ' + modifier));
        }

        var template = instructions[version][type][modifier][level];

        if (step.name && step.name !== '') {
            return cb(
                null,
                template
                  .replace('[', '')
                  .replace(']', '')
                  .replace('{way_name}', step.name)
                  .trim()
            );
        } else {
            // remove name
            return cb(
                null,
                template
                  .replace(/\[.+\]/, '')
                  .trim()
            );
        }
    }
};
