#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var instructions = require('../index.js');
var v5Instructions = instructions('v5');
var constants = require('../test/constants');
var type = process.argv[2];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function underscorify(input) {
    return input.replace(/ /g, '_');
}

function write(step, p) {
    fs.writeFileSync(p, JSON.stringify(step, null, 4) + '\n');
}

function writeVariations(basePath, baseStep, onlyDefault) {
    var step;
    // default
    write({
            step: baseStep,
            instruction: v5Instructions.compile(baseStep)
        },
        `${basePath}_default.json`
    );
    if(onlyDefault) return;

    // name
    step = Object.assign(clone(baseStep), { name: 'Way Name' });
    write({
            step: step,
            instruction: v5Instructions.compile(step)
        },
        `${basePath}_name.json`
    );

    // destination
    step = Object.assign(clone(baseStep), {
        name: 'Way Name',
        destinations: 'Destination 1,Destination 2'
    });
    write({
            step: step,
            instruction: v5Instructions.compile(step)
        },
        `${basePath}_destination.json`
    );
};

function execute() {
    switch (type) {
    case 'turn':
        var basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'turn');

        // do name_ref combinations
        var baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: '',
            ref: 'Ref1;Ref2'
        };
        writeVariations(path.join(basePath, 'left_ref'), baseStep, true);
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name',
            ref: 'Ref1;Ref2'
        };
        writeVariations(path.join(basePath, 'left_ref_name'), baseStep, true);
        baseStep = {
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name',
            ref: 'Ref1;Ref2',
            destinations: 'Destination 1,Destination 2'
        };
        writeVariations(path.join(basePath, 'left_destination_ref_name'), baseStep, true);

        // do variation per modifier
        constants.modifiers.forEach((modifier) => {
            baseStep = {
                maneuver: {
                    type: 'turn',
                    modifier: modifier
                },
                name: ''
            };
            writeVariations(path.join(basePath, underscorify(modifier)), baseStep);
        });
        break;
    case 'rotary':
        // default
        var basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'rotary', 'default');
        var baseStep = {
            maneuver: {
                modifier: 'left', // rotaries don't care about modifiers
                type: 'rotary'
            },
            name: ''
        };
        writeVariations(basePath, baseStep);

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
        writeVariations(basePath, baseStep);

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
        writeVariations(basePath, baseStep);

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
            writeVariations(basePath, baseStep, true);
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
        writeVariations(basePath, baseStep);
        break;
    case 'roundabout':
        // default
        var basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'default');
        var baseStep = {
            maneuver: {
                modifier: 'left', // roundabouts don't care about modifiers
                type: 'roundabout'
            },
            name: ''
        };
        writeVariations(basePath, baseStep);

        // exit
        basePath = path.join(__dirname, '..', 'test', 'fixtures', 'v5', 'roundabout', 'exit');
        baseStep = {
            maneuver: {
                modifier: 'left', // roundaboouts don't care about modifiers
                type: 'roundabout',
                exit: 1
            },
            name: '',
        };
        writeVariations(basePath, baseStep);
        break;
    default:
        console.error('Need to provide valid type as first argument. Supported types: rotary, roundabout');
        process.exit(1);
    }
}

execute();
