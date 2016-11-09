#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var instructions = require('../index.js');
var v5Instructions = instructions('v5', 'en');
var constants = require('../test/constants');
var type = process.argv[2];

var types = [
    'other',
    'turn',
    'roundabout',
    'rotary'
];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function underscorify(input) {
    return input.replace(/ /g, '_');
}

function write(step, p) {
    fs.writeFileSync(
        `${p}.json`,
        JSON.stringify({
            step: step,
            instruction: v5Instructions.compile(step)
        }, null, 4) + '\n'
    );
}

function writeVariations(baseStep, basePath) {
    var step;
    // default
    write(baseStep, `${basePath}_default`);

    // name
    step = Object.assign(clone(baseStep), { name: 'Way Name' });
    write(step, `${basePath}_name`);

    // destination
    step = Object.assign(clone(baseStep), {
        name: 'Way Name',
        destinations: 'Destination 1,Destination 2'
    });
    write(step, `${basePath}_destination`);
};

function execute() {
    var basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', underscorify(type));

    switch (type) {
    case 'modes':
        baseStep = {
            maneuver: {
                type: 'continue',
                modifier: 'straight'
            },
            mode: 'ferry',
            name: ''
        };
        writeVariations(baseStep, path.join(basePath, 'ferry_turn_left'));

        baseStep = {
            maneuver: {
                type: 'fork',
                modifier: 'left'
            },
            mode: 'ferry',
            name: ''
        };
        writeVariations(baseStep, path.join(basePath, 'ferry_fork_left'));

        baseStep = {
            maneuver: {
                type: 'fork',
                modifier: 'left'
            },
            mode: 'driving',
            name: 'Way Name'
        };
        write(baseStep, path.join(basePath, 'driving_turn_left'));
        break;
    case 'other':
        // invalid type
        baseStep = {
            maneuver: {
                type: 'deliberatly_unknown_type',
                modifier: 'left'
            },
            name: 'Way Name',
        };
        write(baseStep, path.join(basePath, 'invalid_type'));

        // way_name name/ref combinations
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: '',
            ref: 'Ref1;Ref2'
        };
        write(baseStep, path.join(basePath, 'way_name_ref'));
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name',
            ref: 'Ref1;Ref2'
        };
        write(baseStep, path.join(basePath, 'way_name_ref_name'));
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name',
            ref: 'Ref1;Ref2',
            destinations: 'Destination 1,Destination 2'
        };
        write(baseStep, path.join(basePath, 'way_name_ref_destinations'));
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name (Ref1)',
            ref: 'Ref1'
        };
        write(baseStep, path.join(basePath, 'way_name_ref_mapbox_hack_1'));
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name (Ref1;Ref2)',
            ref: 'Ref1;Ref2'
        };
        write(baseStep, path.join(basePath, 'way_name_ref_mapbox_hack_2'));
        break;
    case 'merge':
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
            writeVariations(baseStep, path.join(basePath, underscorify(modifier)));
        });
        break;
    case 'rotary':
        // default
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'default');
        var baseStep = {
            maneuver: {
                modifier: 'left', // rotaries don't care about modifiers
                type: 'rotary'
            },
            name: ''
        };
        writeVariations(baseStep, basePath);

        // name
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'name');
        baseStep = {
            maneuver: {
                modifier: 'left', // rotaries don't care about modifiers
                type: 'rotary'
            },
            name: '',
            rotary_name: 'Rotary Name'
        };
        writeVariations(baseStep, basePath);

        // exit
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'exit_1');
        baseStep = {
            maneuver: {
                modifier: 'left', // rotaries don't care about modifiers
                type: 'rotary',
                exit: 1
            },
            name: '',
        };
        writeVariations(baseStep, basePath);

        // exit - all possible exit numbers
        for (i = 2; i <= 11; i++) {
            basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', `exit_${i}`);
            baseStep = {
                maneuver: {
                    modifier: 'left', // rotaries don't care about modifiers
                    type: 'rotary',
                    exit: i
                },
                name: '',
            };
            write(baseStep, basePath);
        };

        // name_exit
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'name_exit');
        baseStep = {
            maneuver: {
                modifier: 'left', // rotaries don't care about modifiers
                type: 'rotary',
                exit: 2 // no need to check ordinalization, already done in exit before
            },
            name: '',
            rotary_name: 'Rotary Name'
        };
        writeVariations(baseStep, basePath);
        break;
    case 'roundabout':
        // default
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'default');
        var baseStep = {
            maneuver: {
                modifier: 'left', // roundabouts don't care about modifiers
                type: 'roundabout'
            },
            name: ''
        };
        writeVariations(baseStep, basePath);

        // exit
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'exit');
        baseStep = {
            maneuver: {
                modifier: 'left', // roundabouts don't care about modifiers
                type: 'roundabout',
                exit: 1
            },
            name: '',
        };
        writeVariations(baseStep, basePath);
        break;
    case 'use lane':
        function lanesFromConfig(config) {
            var lanes = [];
            config.split('').forEach((c) => {
                switch (c) {
                case 'x':
                    lanes.push({
                        indications: ["straight"],
                        valid: false
                    });
                    break;
                case 'o':
                    lanes.push({
                        indications: ["straight"],
                        valid: true
                    });
                    break;
                default:
                    throw 'Invalid config ' + c
                }
            });
            return lanes;
        }
        function writeLaneConfig(config) {
            var step = Object.assign(clone(baseStep));
            step.intersections[0].lanes = lanesFromConfig(config);
            write(step, `${basePath}/${config}`);
        }

        var baseStep = {
            maneuver: {
                modifier: 'straight',
                type: 'use lane'
            },
            intersections: [
                {
                    location: [ 13.39677,52.54366 ],
                    in: 1,
                    out: 2,
                    bearings: [ 10, 20 ],
                    entry: [ true, false ]
                }
            ],
            name: '',
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
    default:
        console.error('Need to provide a type as first argument. Supported values:' + types.join(' ,'));
        process.exit(1);
    }
}

execute();
