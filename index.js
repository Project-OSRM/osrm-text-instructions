var useLane = require('./lib/use-lane');
var instructions = require('./instructions.json');

if (Object !== instructions.constructor) throw 'instructions must be object';

module.exports = function(_version) {
    var version = _version || 'v5';

    var o = {
        ordinalize: function(number) {
            return instructions[version].constants.ordinalize[number.toString()] || '';
        },
        directionFromDegree: function(degree) {
            if (!degree && degree !== 0) {
                // step had no bearing_after degree, ignoring
                return '';
            } else if (degree >= 0 && degree <= 20) {
                return instructions[version].constants.direction.north;
            } else if (degree > 20 && degree < 70) {
                return instructions[version].constants.direction.northeast;
            } else if (degree >= 70 && degree < 110) {
                return instructions[version].constants.direction.east;
            } else if (degree >= 110 && degree <= 160) {
                return instructions[version].constants.direction.southeast;
            } else if (degree > 160 && degree <= 200) {
                return instructions[version].constants.direction.south;
            } else if (degree > 200 && degree < 250) {
                return instructions[version].constants.direction.southwest;
            } else if (degree >= 250 && degree <= 290) {
                return instructions[version].constants.direction.west;
            } else if (degree > 290 && degree < 340) {
                return instructions[version].constants.direction.northwest;
            } else if (degree >= 340 && degree <= 360) {
                return instructions[version].constants.direction.north;
            } else {
                throw new Error('Degree ' + degree + ' invalid');
            }
        },
        compile: function(step) {
            if (!instructions[version]) { throw new Error('Invalid version'); }
            if (!step.maneuver) throw new Error('No step maneuver provided');

            var type = step.maneuver.type;
            var modifier = step.maneuver.modifier;

            if (!type) { throw new Error('Missing step maneuver type'); }
            if (type !== 'depart' && type !== 'arrive' && !modifier) { throw new Error('Missing step maneuver modifier'); }

            if (!instructions[version][type]) {
                // OSRM specification assumes turn types can be added without
                // major version changes. Unknown types are to be treated as
                // type `turn` by clients
                type = 'turn';
            }

            // Use special instructions if available, otherwise `defaultinstruction`
            var instructionObject;
            if (instructions[version][type][modifier]) {
                instructionObject = instructions[version][type][modifier];
            } else {
                instructionObject = instructions[version][type].default;
            }

            // Special case handling
            var laneInstruction;
            switch (type) {
            case 'use lane':
                var laneDiagram = useLane(step);
                laneInstruction = instructions[version][type].lane_types[laneDiagram];

                if (!laneInstruction) {
                    // If the lane combination is not found, default to continue
                    instructionObject = instructions[version][type].no_lanes;
                }
                break;
            case 'rotary':
            case 'roundabout':
                if (step.rotary_name && step.maneuver.exit && instructionObject.name_exit) {
                    instructionObject = instructionObject.name_exit;
                } else if (step.rotary_name && instructionObject.name) {
                    instructionObject = instructionObject.name;
                } else if (step.maneuver.exit && instructionObject.exit) {
                    instructionObject = instructionObject.exit;
                } else {
                    instructionObject = instructionObject.default;
                }
                break;
            default:
                // NOOP, since no special logic for that type
            }

            // Decide which instruction string to use
            // Destination takes precedence over name
            var instruction;
            if (step.destinations && instructionObject.destination) {
                instruction = instructionObject.destination;
            } else if (step.name && instructionObject.name) {
                instruction = instructionObject.name;
            } else {
                instruction = instructionObject.default;
            }

            // Replace tokens
            // NOOP if they don't exist
            var nthWaypoint = ''; // TODO, add correct waypoint counting
            instruction = instruction
                .replace('{nth}', nthWaypoint)
                .replace('{destination}', (step.destinations || '').split(',')[0])
                .replace('{exit_number}', this.ordinalize(step.maneuver.exit || 1))
                .replace('{rotary_name}', step.rotary_name)
                .replace('{lane_instruction}', laneInstruction)
                .replace('{modifier}', instructions[version].constants.modifier[modifier])
                .replace('{direction}', this.directionFromDegree(step.maneuver.bearing_after))
                .replace('{way_name}', step.name)
                .replace(/ {2}/g, ' '); // remove excess spaces

            return instruction;
        }
    };

    return o;
};
