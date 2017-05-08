var path = require('path');
var fs = require('fs');
var tape = require('tape');

var instructions = require('../index');
var languageInstructions = require('../languages');

tape.test('v5 directionFromDegree', function(assert) {
    var v5Instructions = instructions('v5', 'en');

    assert.equal(
        v5Instructions.directionFromDegree(undefined), // eslint-disable-line no-undefined
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
        [ 110, 'east' ],
        [ 111, 'southeast' ],
        [ 159, 'southeast' ],
        [ 160, 'south' ],
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
        () => { v5Instructions.directionFromDegree(361); },
        'throws on out of bounds degree'
    );

    assert.end();
});

tape.test('v5 laneDiagram', function(assert) {
    var v5Instructions = instructions('v5', 'en');

    function makeStep(config) {
        return {
            intersections: [
                {
                    lanes: config.map((v) => ({'valid': v}))
                }
            ]
        };
    }

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
        () => {
            v5Instructions.laneConfig({
                intersections: [
                    {}
                ]
            });
        },
        'throws on non-existing lanes'
    );

    assert.end();
});

tape.test('v5 compile', function(t) {
    t.test('respects options.instructionStringHook', function(assert) {
        var v5Instructions = instructions('v5', 'en', {
            hooks: {
                tokenizedInstruction: function(instruction) {
                    return instruction.replace('{way_name}', '<blink>{way_name}</blink>');
                }
            }
        });

        assert.equal(v5Instructions.compile({
            maneuver: {
                type: 'turn',
                modifier: 'left'
            },
            name: 'Way Name'
        }), 'Turn left onto <blink>Way Name</blink>');
        assert.end();
    });

    t.test('fixtures match generated instructions', function(assert) {
        // pre-load instructions
        var instructionsPerLanguage = {};
        Object.keys(languageInstructions.tags)
            .forEach((t) => {
                instructionsPerLanguage[t] = instructions('v5', t);
            });

        var basePath = path.join(__dirname, 'fixtures', 'v5');

        fs.readdirSync(basePath).forEach(function(type) {
            if (type.match(/^\./)) return; // ignore temporary files

            fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
                if (!file.match(/\.json$/)) return;

                var p = path.join(basePath, type, file);
                var fixture = JSON.parse(fs.readFileSync(p));

                Object.keys(fixture.instructions).forEach((l) => {
                    assert.equal(
                        instructionsPerLanguage[l].compile(fixture.step),
                        fixture.instructions[l],
                        `${type}/${file}/${l}`
                    );
                });
            });
        });

        assert.end();
    });
});

tape.only('v5 precompileLookupTable and compile', function(t) {
    var v5Instructions = instructions('v5', process.env.LANGUAGE || 'en');
    var lookupTable;
    var fixture = {
        steps: [
            {
                maneuver: {
                    type: 'depart',
                    modifier: 'right',
                    bearing_after: 270
                },
                name: "Chain Bridge Road",
                ref: "VA 123"
            },
            {
                maneuver: {
                    type: 'turn',
                    modifier: 'left',
                    bearing_after: 270
                },
                name: "George Washington Memorial Parkway",
                ref: "VA 123"
            },
            {
                maneuver: {
                    type: 'arrive',
                    modifier: 'right',
                    bearing_after: 270
                },
                name: "Chain Bridge Road",
                ref: "VA 123"
            }
        ]
    };

    t.test('generates expected lookup table', function(assert) {
        lookupTable = v5Instructions.precompilePriorityTable(fixture);

        assert.deepEqual(lookupTable, {
            "Chain Bridge Road": 2,
            "VA 123": 3,
            "George Washington Memorial Parkway": 1
        });

        assert.end();
    });

    t.test('has expected compile results', function(assert) {
        assert.deepEqual(fixture.steps.map((step) => {
            return v5Instructions.compile(step, lookupTable);
        }), [
            'Head west on VA 123',
            'Turn left onto VA 123',
            'You have arrived at your destination, on the right'
        ]);

        // Previously:
        // 'Head west on Chain Bridge Road (VA 123)',
        // 'Turn left onto George Washington Memorial Parkway (VA 123)',
        // 'You have arrived at your destination, on the right'

        assert.end();
    });
});
