var fs = require('fs');
var tape = require('tape');
var path = require('path');
var instructions = require('../index.js');
var constants = require('./constants');

tape.test('v5 directionFromDegree', function(assert) {
    var v5Instructions = instructions('v5');

    assert.equal(
        v5Instructions.directionFromDegree(undefined),
        '',
        'empty string for undefined'
    );

    [
        [ 0,   'north' ],
        [ 1,   'north' ],
        [ 20,  'north' ],
        [ 21,  'northeast' ],
        [ 69,  'northeast' ],
        [ 70,  'east' ],
        [ 109, 'east' ],
        [ 110, 'southeast' ],
        [ 160, 'southeast' ],
        [ 161, 'south' ],
        [ 200, 'south' ],
        [ 201, 'southwest' ],
        [ 249, 'southwest' ],
        [ 250, 'west' ],
        [ 290, 'west' ],
        [ 291, 'northwest' ],
        [ 339, 'northwest' ],
        [ 340, 'north' ],
        [ 360, 'north' ]
    ].forEach((d) => {
        assert.equal(
            v5Instructions.directionFromDegree(d[0]),
            d[1],
            `${d[0]} degrees is ${d[1]}`
        );
    });

    assert.throws(
        () => { v5Instructions.directionFromDegree(361) },
        'throws on out of bounds degree'
    );

    assert.end();
});

tape.test('v5 laneDiagram', function(assert) {
    var v5Instructions = instructions('v5');

    function makeStep(config) {
        return {
            intersections: [
                {
                    lanes: config.map((v) => { return { "valid": v }})
                }
            ]
        };
    };

    [
        [ [ true, true, true ], 'o' ],
        [ [ true, true, false], 'ox' ],
        [ [ true, true, false, false], 'ox' ],
        [ [ true, false, true], 'oxo' ],
        [ [ false, true, true, false], 'xox' ],
        [ [ false, true, false, true, false], 'xoxox' ],
        [ [ false, false, false], 'x' ]
    ].forEach((c) => {
        assert.equal(v5Instructions.laneConfig(makeStep(c[0])), c[1], `correct Diagram ${c[1]}`);
    });

    assert.throws(
        () => { v5Instructions.laneConfig({}); },
        'throws on non-existing intersections'
    );

    assert.throws(
        () => { v5Instructions.laneConfig({ intersections: [ {} ] }); },
        'throws on non-existing lanes'
    );

    assert.end();
});

tape.test('v5 compile', function(t) {
    var v5Instructions = instructions('v5');

    t.test('fixtures exist for every type/modifier combinations', function(assert) {
        var instructions = require('../instructions');
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

        constants.types.forEach(function(type) {
            switch(type) {
            case 'turn':
                // name_ref combinations
                assert.ok(
                    fs.existsSync(path.join(basePath, 'turn', `left_ref_default.json`)),
                    `${type}/left_ref_default`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'turn', `left_ref_default.json`)),
                    `${type}/left_ref_name`);
                assert.ok(
                    fs.existsSync(path.join(basePath, 'turn', `left_ref_default.json`)),
                    `${type}/left_destination_ref_name`);

                // regular combinations
                checkModifiers(type);

                break;
            case 'rotary':
                [ 'default', 'exit_1', 'name', 'name_exit' ].forEach((s) => {
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
                for (i = 2; i <= 11; i++) {
                    assert.ok(
                        fs.existsSync(path.join(basePath, 'rotary', `exit_${i}_default.json`)),
                        `${type}/exit_${i}_default`);
                };
                break;
            case 'roundabout':
                [ 'default', 'exit' ].forEach((s) => {
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
            default:
                checkModifiersNoName(type);
                break
            };
        });

        assert.end();
    });

    t.test('fixtures match generated instructions', function(assert) {
        var basePath = path.join(__dirname, 'fixtures', 'v5/');

        fs.readdirSync(basePath).forEach(function(type) {
            if (type === '.DS_Store') return;

            fs.readdirSync(basePath + type).forEach(function(file) {
                if (!file.match(/json$/)) return;

                var p = path.join(basePath, type, file);
                var fixture = JSON.parse(fs.readFileSync(p));

                if (process.env.UPDATE) {
                    fixture.instruction = v5Instructions.compile(fixture.step);
                    fs.writeFileSync(p, JSON.stringify(fixture, null, 4) + '\n');
                } else {
                    assert.equal(
                        v5Instructions.compile(fixture.step),
                        fixture.instruction,
                        type + '/' + file
                    );
                }
            });
        });

        assert.end();
    });
});
