var path = require('path');
var fs = require('fs');
var tape = require('tape');
var constants = require('./constants');

tape.test('fixtures exist for every type/modifier combinations', function(assert) {
    var instructions = require('../instructions').get('en');
    var basePath = path.join(__dirname, 'fixtures', 'v5');

    function underscorify(input) {
        return input.replace(/ /g, '_');
    }

    function checkModifiers(type) {
        constants.modifiers.forEach(function(modifier) {
            assert.ok(
                fs.existsSync(path.join(basePath, underscorify(type), `${underscorify(modifier)}_default.json`)),
                `${type}/${modifier}_default`);
            assert.ok(
                fs.existsSync(path.join(basePath, underscorify(type), `${underscorify(modifier)}_destination.json`)),
                `${type}/${modifier}_destination`);
            assert.ok(
                fs.existsSync(path.join(basePath, underscorify(type), `${underscorify(modifier)}_name.json`)),
                `${type}/${modifier}_name`);
        });
    }

    function checkModifiersNoName(type) {
        // TODO: Remove this function and replace it complately by checkModifiers
        constants.modifiers.forEach(function(modifier) {
            // check normal fixture
            var p = path.join(basePath, underscorify(type), underscorify(modifier) + '.json');

            assert.ok(fs.existsSync(p), type + '/' + modifier);

            // check no_name fixture if should exist
            var noNamePath = path.join(basePath, underscorify(type), underscorify(modifier) + '_no_name.json');

            if (instructions.v5[type].default.name ||
                instructions.v5[type].default.default.name
            ) {
                assert.ok(fs.existsSync(noNamePath), type + '/' + modifier + '/no name');
            }
        });
    }

    var types = constants.types;
    types.push('other');
    types.forEach(function(type) {
        switch (type) {
        case 'other':
            [
                'invalid_type',
                'way_name_ref',
                'way_name_ref_name',
                'way_name_ref_destinations',
                'way_name_ref_mapbox_hack_1',
                'way_name_ref_mapbox_hack_2'
            ].forEach((f) => {
                assert.ok(
                    fs.existsSync(path.join(basePath, 'other', `${f}.json`)),
                    `${type}/${f}`);
            });
            break;
        case 'merge':
        case 'turn':
            checkModifiers(type);
            break;
        case 'rotary':
            ['default', 'exit_1', 'name', 'name_exit'].forEach((s) => {
                assert.ok(
                    fs.existsSync(path.join(basePath, 'rotary', `${s}_default.json`)),
                    `${type}/${s}_default`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'rotary', `${s}_destination.json`)),
                    `${type}/${s}_destination`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'rotary', `${s}_name.json`)),
                    `${type}/${s}_name`);
            });

            // special fixtures for ordinalization
            for (var i = 2; i <= 11; i += 1) {
                assert.ok(
                    fs.existsSync(path.join(basePath, 'rotary', `exit_${i}.json`)),
                    `${type}/exit_${i}_default`);
            }
            break;
        case 'roundabout':
            ['default', 'exit'].forEach((s) => {
                assert.ok(
                    fs.existsSync(path.join(basePath, 'roundabout', `${s}_default.json`)),
                    `${type}/${s}_default`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'roundabout', `${s}_destination.json`)),
                    `${type}/${s}_destination`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'roundabout', `${s}_name.json`)),
                    `${type}/${s}_name`);
            });
            break;
        case 'use lane':
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
                assert.ok(
                    fs.existsSync(path.join(basePath, 'use_lane', `${c}.json`)),
                    `use_lane/${c}`
                );
            });
            break;
        default:
            checkModifiersNoName(type);
            break;
        }
    });

    assert.end();
});
