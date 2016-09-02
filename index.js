var instructions = require('./instructions.json');

// Assertions
if (Object !== instructions.constructor) throw 'instructions must be object';

module.exports = {
    compile: function(step, version, cb) {
        // TODO: Validations

        var type = step.maneuver.type;
        var modifier = step.maneuver.modifier;

        if (!instructions[version]) { return cb(new Error('Invalid version')); }
        if (!type) { return cb(new Error('Missing step maneuver type')); }
        if (!modifier) { return cb(new Error('Missing step maneuver modifier')); }
        if (!instructions[version][type]) return cb(new Error('Unknown type', type));
        if (!step.maneuver.modifier) return cb(new Error('No maneuver provided'));


        // First check if the modifier for this maneuver has a special instruction
        // If not, use the `defaultInstruction`
        var template = instructions[version][type][modifier]
            ? instructions[version][type][modifier] : instructions[version][type].defaultInstruction;

        if (step.name && step.name !== '') {
            return cb(
                null,
                template
                    .replace('[', '')
                    .replace(']', '')
                    .replace('{way_name}', step.name)
                    .replace('{modifier}', step.maneuver.modifier)
                    .trim()
            );
        } else {
            // remove name
            return cb(
                null,
                template
                    .replace(/\[.+\]/, '')
                    .replace('{modifier}', step.maneuver.modifier)
                    .trim()
            );
        }
    }
};
