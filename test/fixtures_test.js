/* eslint max-lines: "off", no-inner-declarations: "off" */

var path = require('path');
var fs = require('fs');
var tape = require('tape');
var mkdirp = require('mkdirp');

var constants = require('./constants');
var instructions = require('../index.js');
var supportedCodes = require('../languages').supportedCodes

// Load instructions files for each language
var languages = instructions('v5');

tape.test('verify existance/update fixtures', function(assert) {
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function underscorify(input) {
        return input.replace(/ /g, '_');
    }

    function instructionsForLanguages(step, legIndex) {
        var result = {};

        supportedCodes.forEach((k) => {
            result[k] = languages.compile(k, step, legIndex);
        });

        return result;
    }

    function checkOrWrite(step, p, legIndex) {
        var fileName = `${p}.json`;
        var testName = p
            .split('/')
            .slice(-2)
            .join('/');

        if (process.env.UPDATE) {
            // write fixture
            fs.writeFileSync(
                fileName,
                JSON.stringify({
                    step: step,
                    instructions: instructionsForLanguages(step, legIndex)
                }, null, 4) + '\n'
            );
            assert.ok(true, `updated ${testName}`);
        } else {
            // check for existance
            assert.ok(
                fs.existsSync(fileName),
                `verified existance of ${testName}`
            );
        }
    }

    function checkOrWriteVariations(baseStep, basePath) {
        var step;
        // default
        checkOrWrite(baseStep, `${basePath}_default`);

        // name
        step = Object.assign(clone(baseStep), {name: 'Way Name'});
        checkOrWrite(step, `${basePath}_name`);

        // destination
        step = Object.assign(clone(baseStep), {
            name: 'Way Name',
            destinations: 'Destination 1,Destination 2'
        });
        checkOrWrite(step, `${basePath}_destination`);
    }

    [ 'modes', 'other', 'arriveWayPoint'].concat(constants.types).forEach((type) => {
        var basePath = path.join(__dirname, 'fixtures', 'v5', underscorify(type));
        var baseStep, step;

        // verify directory exists
        mkdirp.sync(basePath);

        switch (type) {
        case 'arrive':
            step = {
                maneuver: {
                    type: 'arrive'
                },
                name: 'Street Name'
            };
            checkOrWrite(step, path.join(basePath, 'no_modifier'));

            constants.modifiers.forEach((modifier) => {
                var step = {
                    maneuver: {
                        type: 'arrive',
                        modifier: modifier
                    },
                    name: 'Street Name'
                };
                checkOrWrite(step, path.join(basePath, underscorify(modifier)));
            });
            break;
        case 'arriveWayPoint':
            step = {
                maneuver: {
                    type: 'arrive'
                },
                name: 'Street Name'
            };
            checkOrWrite(step, path.join(basePath, 'no_modifier'), 1);

            constants.modifiers.forEach((modifier) => {
                var step = {
                    maneuver: {
                        type: 'arrive',
                        modifier: modifier
                    },
                    name: 'Street Name'
                };
                checkOrWrite(step, path.join(basePath, underscorify(modifier)), 1);
            });
            break;
        case 'depart':
            step = {
                maneuver: {
                    'bearing_after': 0,
                    type: 'depart',
                    modifier: 'left'
                },
                name: ''
            };
            checkOrWriteVariations(step, path.join(basePath, 'modifier'));

            constants.directions.forEach((direction) => {
                direction.slice(1).forEach((bearing) => {
                    var step = {
                        maneuver: {
                            'bearing_after': bearing,
                            type: 'depart'
                        },
                        name: ''
                    };
                    checkOrWrite(step, path.join(basePath, `${direction[0]}_${bearing}`));
                });
            });
            break;
        case 'modes':
            baseStep = {
                maneuver: {
                    type: 'continue',
                    modifier: 'straight'
                },
                mode: 'ferry',
                name: ''
            };
            checkOrWriteVariations(baseStep, path.join(basePath, 'ferry_turn_left'));

            baseStep = {
                maneuver: {
                    type: 'fork',
                    modifier: 'left'
                },
                mode: 'ferry',
                name: ''
            };
            checkOrWriteVariations(baseStep, path.join(basePath, 'ferry_fork_left'));

            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                mode: 'driving',
                name: 'Way Name'
            };
            checkOrWrite(baseStep, path.join(basePath, 'driving_turn_left'));
            break;
        case 'other':
            // invalid type
            baseStep = {
                maneuver: {
                    type: 'deliberatly_unknown_type',
                    modifier: 'left'
                },
                name: 'Way Name'
            };
            checkOrWrite(baseStep, path.join(basePath, 'invalid_type'));

            // way_name name/ref combinations
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: '',
                ref: 'Ref1;Ref2'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref'));
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: 'Way Name',
                ref: 'Ref1;Ref2'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref_name'));
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: 'Way Name',
                ref: 'Ref1;Ref2',
                destinations: 'Destination 1,Destination 2'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref_destinations'));
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: 'Way Name (Ref1 (Another+Way \\ (Ref1.1)))',
                ref: 'Ref1 (Another+Way \\ (Ref1.1))'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref_mapbox_hack_1'));
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: 'Way Name (Ref0;Ref1 (Another Way (Ref1.1));Ref2)',
                ref: 'Ref0;Ref1 (Another Way (Ref1.1));Ref2'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref_mapbox_hack_2'));
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                },
                name: 'Ref0;Ref1 (Another Way (Ref1.1));Ref2',
                ref: 'Ref0;Ref1 (Another Way (Ref1.1));Ref2'
            };
            checkOrWrite(baseStep, path.join(basePath, 'way_name_ref_mapbox_hack_3'));
            break;
        case 'continue':
        case 'end of road':
        case 'fork':
        case 'merge':
        case 'new name':
        case 'notification':
        case 'on ramp':
        case 'off ramp':
        case 'roundabout turn':
        case 'turn':
            // do variation per modifier
            constants.modifiers.forEach((modifier) => {
                baseStep = {
                    maneuver: {
                        type: type,
                        modifier: modifier
                    },
                    name: ''
                };
                checkOrWriteVariations(baseStep, path.join(basePath, underscorify(modifier)));
            });
            break;
        case 'rotary':
            // default
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'default');
            baseStep = {
                maneuver: {
                    modifier: 'left', // rotaries don't care about modifiers
                    type: 'rotary'
                },
                name: ''
            };
            checkOrWriteVariations(baseStep, basePath);

            // name
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'name');
            baseStep = {
                maneuver: {
                    modifier: 'left', // rotaries don't care about modifiers
                    type: 'rotary'
                },
                name: '',
                'rotary_name': 'Rotary Name'
            };
            checkOrWriteVariations(baseStep, basePath);

            // exit
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'exit_1');
            baseStep = {
                maneuver: {
                    modifier: 'left', // rotaries don't care about modifiers
                    type: 'rotary',
                    exit: 1
                },
                name: ''
            };
            checkOrWriteVariations(baseStep, basePath);

            // exit - all possible exit numbers
            for (var i = 2; i <= 11; i += 1) {
                basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', `exit_${i}`);
                baseStep = {
                    maneuver: {
                        modifier: 'left', // rotaries don't care about modifiers
                        type: 'rotary',
                        exit: i
                    },
                    name: ''
                };
                checkOrWrite(baseStep, basePath);
            }

            // name_exit
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'name_exit');
            baseStep = {
                maneuver: {
                    modifier: 'left', // rotaries don't care about modifiers
                    type: 'rotary',
                    exit: 2 // no need to check ordinalization, already done in exit before
                },
                name: '',
                'rotary_name': 'Rotary Name'
            };
            checkOrWriteVariations(baseStep, basePath);
            break;
        case 'roundabout':
            // default
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'default');
            baseStep = {
                maneuver: {
                    modifier: 'left', // roundabouts don't care about modifiers
                    type: 'roundabout'
                },
                name: ''
            };
            checkOrWriteVariations(baseStep, basePath);

            // exit
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'exit');
            baseStep = {
                maneuver: {
                    modifier: 'left', // roundabouts don't care about modifiers
                    type: 'roundabout',
                    exit: 1
                },
                name: ''
            };
            checkOrWriteVariations(baseStep, basePath);
            break;
        case 'use lane': {
            function lanesFromConfig(config) {
                var lanes = [];
                config.split('').forEach((c) => {
                    switch (c) {
                    case 'x':
                        lanes.push({
                            indications: ['straight'],
                            valid: false
                        });
                        break;
                    case 'o':
                        lanes.push({
                            indications: ['straight'],
                            valid: true
                        });
                        break;
                    default:
                        throw 'Invalid config ' + c;
                    }
                });

                return lanes;
            }
            function writeLaneConfig(config) {
                var step = Object.assign(clone(baseStep));
                step.intersections[0].lanes = lanesFromConfig(config);
                checkOrWrite(step, `${basePath}/${config}`);
            }

            baseStep = {
                maneuver: {
                    modifier: 'straight',
                    type: 'use lane'
                },
                intersections: [
                    {
                        location: [ 13.39677, 52.54366 ],
                        in: 1,
                        out: 2,
                        bearings: [ 10, 20 ],
                        entry: [ true, false ]
                    }
                ],
                name: ''
            };

            // lane combinations
            [
                'o',
                'ooo',
                'oox',
                'xoo',
                'xox',
                'oxo',
                'xxoo',
                'ooxx',
                'xxoxo',
                'xxooxx',
                'oooxxo'
            ].forEach((c) => {
                writeLaneConfig(c);
            });
            break;
        }
        default:
            throw `Unsupported type ${type}. Supported types: ${constants.types.join(' ,')}`;
        }
    });

    assert.end();
});
