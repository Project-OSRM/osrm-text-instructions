var languages = require('./languages');
var instructions = languages.instructions;
var grammars = languages.grammars;
var abbreviations = languages.abbreviations;

module.exports = function(version) {
    Object.keys(instructions).forEach(function(code) {
        if (!instructions[code][version]) { throw 'invalid version ' + version + ': ' + code + ' not supported'; }
    });

    return {
        capitalizeFirstLetter: function(language, string) {
            return string.charAt(0).toLocaleUpperCase(language) + string.slice(1);
        },
        ordinalize: function(language, number) {
            // Transform numbers to their translated ordinalized value
            if (!language) throw new Error('No language code provided');

            return instructions[language][version].constants.ordinalize[number.toString()] || '';
        },
        directionFromDegree: function(language, degree) {
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
        getWayName: function(language, step, options) {
            var classes = options ? options.classes || [] : [];
            if (typeof step !== 'object') throw new Error('step must be an Object');
            if (!language) throw new Error('No language code provided');
            if (!Array.isArray(classes)) throw new Error('classes must be an Array or undefined');

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
                var phrase = instructions[language][version].phrase['name and ref'] ||
                    instructions.en[version].phrase['name and ref'];
                wayName = this.tokenize(language, phrase, {
                    name: name,
                    ref: ref
                }, options);
            } else if (name && ref && wayMotorway && (/\d/).test(ref)) {
                wayName = options && options.formatToken ? options.formatToken('ref', ref) : ref;
            } else if (!name && ref) {
                wayName = options && options.formatToken ? options.formatToken('ref', ref) : ref;
            } else {
                wayName = options && options.formatToken ? options.formatToken('name', name) : name;
            }

            return wayName;
        },
        scaleOf: function(number) {
            return Math.pow(10, parseInt(Math.log10(number)))
        },
        roundToIntPrecision: function(distance, precision) {
            var value = Math.round(precision)*parseInt(parseFloat(distance)/parseFloat(precision))
            return value
        },
        getInstruction: function(step, instructionObject, wayName, options) {
            // Decide which instruction string to use
            // In order of precedence:
            //   - exit + destination signage
            //   - destination signage
            //   - exit signage
            //   - junction name
            //   - road name
            //   - waypoint name (for arrive maneuver)
            //   - default
            if (step.destinations && step.exits && instructionObject.exit_destination)
                return instructionObject.exit_destination;

            if (step.destinations && instructionObject.destination)
                return  instructionObject.destination;

            if (step.exits && instructionObject.exit)
                return instructionObject.exit;

            if (step.junction_name && instructionObject.junction_name)
                return instructionObject.junction_name;

            if (wayName && instructionObject.name)
                return instructionObject.name;

            if (options.waypointName && instructionObject.named)
                return instructionObject.named;

            return  instructionObject.default;
        },
        /**
         * Formulate a localized text instruction from a step.
         *
         * @param  {string} language                                Language code.
         * @param  {object} step                                    Step including maneuver property.
         * @param  {object} opts                                    Additional options.
         * @param  {string} opts.legIndex                           Index of leg in the route.
         * @param  {string} opts.legCount                           Total number of legs in the route.
         * @param  {array}  opts.classes                            List of road classes.
         * @param  {string} opts.waypointName                       Name of waypoint for arrival instruction.
         * @param  {bool}   opts.verboseNavigation                  Enable verbose navigation
         * @param  {double} opts.announcementsDistancesBelow500m    Distances of announcements below 500m    
         * @param  {double} opts.announcementsWayMinimumDistance    Minimum distance to include way name into instruction
         * @param  {double} opts.distanceLastAnnouncement           Distance for last announcement of step
         *
         * @return {string}                                         Localized text instruction. 
         * @return {void}                                           If verbose navigation is enabled  
         */
        compile: function(language, step, opts) {
            if (!language) throw new Error('No language code provided');
            if (languages.supportedCodes.indexOf(language) === -1) throw new Error('language code ' + language + ' not loaded');
            if (!step.maneuver) throw new Error('No step maneuver provided');
            var options = opts || {};

            var type = step.maneuver.type;
            var modifier = step.maneuver.modifier;
            var mode = step.mode;
            // driving_side will only be defined in OSRM 5.14+
            var side = step.driving_side;

            if (!type) { throw new Error('Missing step maneuver type'); }
            if (type !== 'depart' && type !== 'arrive' && !modifier) { throw new Error('Missing step maneuver modifier'); }

            if (!instructions[language][version][type]) {
                // Log for debugging
                console.log('Encountered unknown instruction type: ' + type); // eslint-disable-line no-console
                // OSRM specification assumes turn types can be added without
                // major version changes. Unknown types are to be treated as
                // type `turn` by clients
                type = 'turn';
            }

            // Use special instructions if available, otherwise `defaultinstruction`
            var instructionObject;
            if (instructions[language][version].modes[mode]) {
                instructionObject = instructions[language][version].modes[mode];
            } else {
                // omit side from off ramp if same as driving_side
                // note: side will be undefined if the input is from OSRM <5.14
                // but the condition should still evaluate properly regardless
                var omitSide = type === 'off ramp' && modifier.indexOf(side) >= 0;
                if (instructions[language][version][type][modifier] && !omitSide) {
                    instructionObject = instructions[language][version][type][modifier];
                } else {
                    instructionObject = instructions[language][version][type].default;
                }
            }

            // Special case handling
            var laneInstruction;
            switch (type) {
            case 'use lane':
                laneInstruction = instructions[language][version].constants.lanes[this.laneConfig(step)];
                if (!laneInstruction) {
                    // If the lane combination is not found, default to continue straight
                    instructionObject = instructions[language][version]['use lane'].no_lanes;
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
            var wayName = this.getWayName(language, step, options);

            var instruction = this.getInstruction(step, instructionObject, wayName, options);

            var destinations = step.destinations && step.destinations.split(': ');
            var destinationRef = destinations && destinations[0].split(',')[0];
            var destination = destinations && destinations[1] && destinations[1].split(',')[0];
            var firstDestination;
            if (destination && destinationRef) {
                firstDestination = destinationRef + ': ' + destination;
            } else {
                firstDestination = destinationRef || destination || '';
            }

            var nthWaypoint = options.legIndex >= 0 && options.legIndex !== options.legCount - 1 ? this.ordinalize(language, options.legIndex + 1) : '';

            // Replace tokens
            // NOOP if they don't exist
            var replaceTokens = {
                'way_name': wayName,
                'destination': firstDestination,
                'exit': (step.exits || '').split(';')[0],
                'exit_number': this.ordinalize(language, step.maneuver.exit || 1),
                'rotary_name': step.rotary_name,
                'lane_instruction': laneInstruction,
                'modifier': instructions[language][version].constants.modifier[modifier],
                'direction': this.directionFromDegree(language, step.maneuver.bearing_after),
                'nth': nthWaypoint,
                'waypoint_name': options.waypointName,
                'junction_name': (step.junction_name || '').split(';')[0]
            };
            
            var instruction_one = this.tokenize(language, instruction, replaceTokens, options);

            if (!options.verboseNavigation)
                return instruction_one
            
            var announcements = []
            
            var announcementsWayMinimumDistance = options.announcementsWayMinimumDistance ||250.0
            var announcementsDistanceBelow500m = options.announcementsDistancesBelow500m || 150.0
            
            var announcementsDistance;
            
            var phrase = instructions[language][version].phrase['one in distance'] ||
            instructions.en[version].phrase['one in distance'];
            
            // Get the rounding of distance based on the scale of step.distance
            // Ex.: 3606.5 -> 3000
            var distance = this.roundToIntPrecision(step.distance, this.scaleOf(step.distance))

            var distanceLastAnnouncement = options.distanceLastAnnouncement || 30.0 
            if (distanceLastAnnouncement > 100.0)
                throw new Error('Reduce last announcement distance');

            if (distanceLastAnnouncement > step.distance)
                distanceLastAnnouncement = step.distance

            do{

                announcementsDistance = announcementsDistanceBelow500m
                if (distance >= 500)
                    // If the distance is longer than 500 meters the announcementsDistance is the half of rounding distance to the scale
                    // Ex.
                    // d: distance, s: scaleOf(distance), rD: roundToIntPrecision(d, tPd), aD: announcementsDistance
                    // IN
                    // d: 3000
                    // s: 1000
                    // OUT
                    // rD: 3000
                    // aD: 1500
                    announcementsDistance = this.roundToIntPrecision(distance, this.scaleOf(distance))/2 

                replaceTokens.instruction_one = instruction_one

                if(distance > announcementsWayMinimumDistance) {

                    var noWayNameInstruction = this.getInstruction(step, instructionObject, null, options)
                    replaceTokens.instruction_one = this.tokenize(language, noWayNameInstruction, replaceTokens, options);
                }

                // Rounded distance to integer multiple of announcementsDistance  
                var thatDistance = this.roundToIntPrecision(distance, announcementsDistance)

                var announcement = ""

                if (thatDistance > distanceLastAnnouncement) {
                    
                    replaceTokens.distance = thatDistance
                    announcement = this.tokenize(language, phrase, replaceTokens, options);
                    distanceAlongGeometry = thatDistance                
                } else {
                    announcement = instruction_one
                    distanceAlongGeometry = distanceLastAnnouncement
                }

                announcements.push(
                    {
                        announcement: announcement,
                        ssmlAnnouncement: `<speak>${announcement}</speak>`,
                        distanceAlongGeometry: distanceAlongGeometry
                    }
                )

                distance -= announcementsDistance;
                
            } while(distance >= 0);

            step.bannerInstructions = [
                {
                    primary: {
                        type: type,
                        modifier: modifier,
                        text: wayName,
                        components: [
                            {
                                text: wayName,
                                type: "text"
                            }
                        ]
                    },
                    distanceAlongGeometry: step.distance
                }
            ]
            step.voiceInstructions = announcements;

            return;

        },
        grammarize: function(language, name, grammar) {
            if (!language) throw new Error('No language code provided');
            // Process way/rotary/any name with applying grammar rules if any
            if (grammar && grammars && grammars[language] && grammars[language][version]) {
                var rules = grammars[language][version][grammar];
                if (rules) {
                    // Pass original name to rules' regular expressions enclosed with spaces for simplier parsing
                    var n = ' ' + name + ' ';
                    var flags = grammars[language].meta.regExpFlags || '';
                    rules.forEach(function(rule) {
                        var re = new RegExp(rule[0], flags);
                        n = n.replace(re, rule[1]);
                    });

                    return n.trim();
                }
            }

            return name;
        },
        abbreviations: abbreviations,
        tokenize: function(language, instruction, tokens, options) {
            if (!language) throw new Error('No language code provided');
            // Keep this function context to use in inline function below (no arrow functions in ES4)
            var that = this;
            var startedWithToken = false;
            var output = instruction
                .replace(/\{(\w+)(?::(\w+))?\}/g, function(token, tag, grammar, offset) {
                    var value = tokens[tag];

                    // Return unknown token unchanged
                    if (typeof value === 'undefined') {
                        return token;
                    }

                    value = that.grammarize(language, value, grammar);

                    // If this token appears at the beginning of the instruction, capitalize it.
                    if (offset === 0 && instructions[language].meta.capitalizeFirstLetter) {
                        startedWithToken = true;
                        value = that.capitalizeFirstLetter(language, value);
                    }

                    if (options && options.formatToken) {
                        value = options.formatToken(tag, value);
                    }

                    return value;
                })
                .replace(/ {2}/g, ' '); // remove excess spaces

            if (!startedWithToken && instructions[language].meta.capitalizeFirstLetter) {
                return this.capitalizeFirstLetter(language, output);
            }

            return output;
        }
    };
};
