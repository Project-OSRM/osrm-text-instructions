module.exports = function(version, language, options) {
    // load instructions
    var instructions = require('./languages').get(language);
    if (Object !== instructions.constructor) throw 'instructions must be object';
    if (!instructions[version]) { throw 'invalid version ' + version; }

    return {
        capitalizeFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        ordinalize: function(number) {
            // Transform numbers to their translated ordinalized value
            return instructions[version].constants.ordinalize[number.toString()] || '';
        },
        directionFromDegree: function(degree) {
            // Transform degrees to their translated compass direction
            if (!degree && degree !== 0) {
                // step had no bearing_after degree, ignoring
                return '';
            } else if (degree >= 0 && degree <= 20) {
                return instructions[version].constants.direction.north;
            } else if (degree > 20 && degree < 70) {
                return instructions[version].constants.direction.northeast;
            } else if (degree >= 70 && degree <= 110) {
                return instructions[version].constants.direction.east;
            } else if (degree > 110 && degree < 160) {
                return instructions[version].constants.direction.southeast;
            } else if (degree >= 160 && degree <= 200) {
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
        laneConfig: function(step) {
            // Reduce any lane combination down to a contracted lane diagram
            if (!step.intersections || !step.intersections[0].lanes) throw new Error('No lanes object');

            var config = [];
            var currentLaneValidity = null;

            step.intersections[0].lanes.forEach(function (lane) {
                if (currentLaneValidity === null || currentLaneValidity !== lane.valid) {
                    if (lane.valid) {
                        config.push('o');
                    } else {
                        config.push('x');
                    }
                    currentLaneValidity = lane.valid;
                }
            });

            return config.join('');
        },
        precompilePriorityTable: function(route) {
            priorityTable = {};

            function safeIncrease(obj, key) {
                if (obj[key]) {
                    obj[key] = obj[key] + 1
                } else {
                    obj[key] = 1
                }
            }

            route.legs.forEach(function(leg) {
                leg.steps.forEach(function(step) {
                    if (step.name) {
                        safeIncrease(priorityTable, step.name);
                    }
                    if (step.ref) {
                        step.ref.split(';').forEach(function(ref) {
                            safeIncrease(priorityTable, ref.trim())
                        })
                    }
                });
            });

            console.log(priorityTable);

            return priorityTable;
        },
        compile: function(step, priorityTable) {
            if (!step.maneuver) throw new Error('No step maneuver provided');

            var type = step.maneuver.type;
            var modifier = step.maneuver.modifier;
            var mode = step.mode;

            if (!type) { throw new Error('Missing step maneuver type'); }
            if (type !== 'depart' && type !== 'arrive' && !modifier) { throw new Error('Missing step maneuver modifier'); }

            if (!instructions[version][type]) {
                // Log for debugging
                console.log('Encountered unknown instruction type: ' + type); // eslint-disable-line no-console
                // OSRM specification assumes turn types can be added without
                // major version changes. Unknown types are to be treated as
                // type `turn` by clients
                type = 'turn';
            }

            // Use special instructions if available, otherwise `defaultinstruction`
            var instructionObject;
            if (instructions[version].modes[mode]) {
                instructionObject = instructions[version].modes[mode];
            } else if (instructions[version][type][modifier]) {
                instructionObject = instructions[version][type][modifier];
            } else {
                instructionObject = instructions[version][type].default;
            }

            // Special case handling
            var laneInstruction;
            switch (type) {
            case 'use lane':
                laneInstruction = instructions[version].constants.lanes[this.laneConfig(step)];

                if (!laneInstruction) {
                    // If the lane combination is not found, default to continue straight
                    instructionObject = instructions[version]['use lane'].no_lanes;
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

            // Decide way_name with special handling for name and ref
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

            // alter by priority
            if (priorityTable) {
                // get all scores
                collect = [];
                if (name) {
                    if (!priorityTable[name]) throw new Error('name ' + name + ' not in priorityTable');
                    collect.push({
                        type: 'name',
                        value: name,
                        score: priorityTable[name]
                    });
                }
                if (step.ref) {
                    step.ref.split(';').forEach(function(_ref) {
                        const ref = _ref.trim();
                        if(!priorityTable[ref]) throw new Error('ref ' + ref + ' not in priorityTable');
                        collect.push({
                            type: 'ref',
                            value: ref,
                            score: priorityTable[ref]
                        });
                    });
                }

                if (collect.length > 0) {
                    // find the highest score
                    res = collect.reduce(function(a, b) {
                        return (a.score > b.score) ? a : b;
                    }, { score: 0 });
                    console.log(collect, res);

                    if (res) {
                        // save for later
                        if (res.type === 'name') {
                            name = res.value;
                            ref = null;
                        } else if (res.type === 'ref') {
                            name = null;
                            ref = res.value;
                        } else {
                            throw new Error('unknown type ' + res.type + 'in ' + JSON.stringify(res));
                        }
                    }
                }
            }

            // select
            if (name && ref && name !== ref) {
                wayName = name + ' (' + ref + ')';
            } else if (!name && ref) {
                wayName = ref;
            } else {
                wayName = name;
            }

            // Decide which instruction string to use
            // Destination takes precedence over name
            var instruction;
            if (step.destinations && instructionObject.destination) {
                instruction = instructionObject.destination;
            } else if (wayName && instructionObject.name) {
                instruction = instructionObject.name;
            } else {
                instruction = instructionObject.default;
            }

            var tokenizedInstructionHook = ((options || {}).hooks || {}).tokenizedInstruction;
            if (tokenizedInstructionHook) {
                instruction = tokenizedInstructionHook(instruction);
            }

            // Replace tokens
            // NOOP if they don't exist
            var nthWaypoint = ''; // TODO, add correct waypoint counting
            instruction = instruction
                .replace('{way_name}', wayName)
                .replace('{destination}', (step.destinations || '').split(',')[0])
                .replace('{exit_number}', this.ordinalize(step.maneuver.exit || 1))
                .replace('{rotary_name}', step.rotary_name)
                .replace('{lane_instruction}', laneInstruction)
                .replace('{modifier}', instructions[version].constants.modifier[modifier])
                .replace('{direction}', this.directionFromDegree(step.maneuver.bearing_after))
                .replace('{nth}', nthWaypoint)
                .replace(/ {2}/g, ' '); // remove excess spaces

            if (instructions.meta.capitalizeFirstLetter) {
                instruction = this.capitalizeFirstLetter(instruction);
            }

            return instruction;
        }
    };
};
