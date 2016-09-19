var ordinalize = require('number-to-words').toWordsOrdinal;
var useLane = require('./lib/use-lane');
var utils = require('./lib/utils');
var instructions = require('./instructions.json');

if (Object !== instructions.constructor) throw 'instructions must be object';

module.exports = function(_version) {
    var version = _version || 'v5';

    return {
        compile: function(step) {
            var type = step.maneuver.type;
            var modifier = step.maneuver.modifier;

            if (!instructions[version]) { throw new Error('Invalid version'); }
            if (!type) { throw new Error('Missing step maneuver type'); }
            if (!modifier) { throw new Error('Missing step maneuver modifier'); }
            if (!step.maneuver.modifier) throw new Error('No maneuver provided');

            if (!instructions[version][type]) {
                // osrm specification assumes turn types can be added without
                // major voersion changes and unknown types are treated
                // as type `turn` by clients
                type = 'turn';
            }

            // First check if the modifier for this maneuver has a special instruction
            // If not, use the `defaultInstruction`
            var instruction = instructions[version][type][modifier]
                ? instructions[version][type][modifier] : instructions[version][type].defaultInstruction;

            // Special cases, code here should be kept to a minimum
            // If possible, change the instruction in `instructions.json`
            // This switch statement is for specical cases that occur at runtime
            switch (type) {
            case 'arrive':
                // TODO, add wayPoint argument
                // instruction = instruction.replace('{nth}', nthWaypoint).replace('  ', ' ');
                break;
            case 'depart':
                // Always use cardinal direction for departure.
                instruction = instruction.replace('{modifier}', utils.getDirectionFromDegree(step.maneuver.bearing_after)[0]);
                break;
            case 'notification':
                // TODO
                break;
            case 'roundabout':
            case 'rotary':
                instruction = instruction.replace('{rotary_name}', step.rotary_name || 'the rotary');
                if (step.name && step.maneuver.exit) {
                    instruction += ' and take the ' + ordinalize(step.maneuver.exit) + ' exit onto {way_name}';
                } else if (step.maneuver.exit) {
                    instruction += ' and take the ' + ordinalize(step.maneuver.exit) + ' exit';
                } else if (step.name) {
                    instruction += ' and exit onto {way_name}';
                }
                break;
            case 'use lane':
                var laneDiagram = useLane(step);
                var laneInstruction = instructions[version][type].laneTypes[laneDiagram];

                if (laneInstruction) {
                    instruction = instruction.replace('{laneInstruction}', laneInstruction);
                } else {
                    // If the lane combination is not found, default to continue
                    instruction = instructions[version][type].defaultInstruction;
                }
                break;
            default:
                break;
            }

            // Handle instructions with names
            if (step.name && step.name !== '') {
                instruction = instruction
                    .replace('[', '')
                    .replace(']', '')
                    .replace('{way_name}', step.name);
            } else {
                instruction = instruction.replace(/\[.+\]/, '');
            }

            // Cleaning for all instructions
            instruction = instruction
                // If a modifier is not provided, calculate direction given bearing
                .replace('{modifier}', modifier || utils.getDirectionFromDegree(step.maneuver.bearing_after)[0])
                .trim();

            return instruction;
        }
    };
};
