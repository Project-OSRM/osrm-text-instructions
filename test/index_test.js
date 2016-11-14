var path = require('path');
var fs = require('fs');
var tape = require('tape');
var instructions = require('../index.js');

tape.test('v5 directionFromDegree', function(assert) {
    var v5Instructions = instructions('v5', 'en');

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
    var v5Instructions = instructions('v5', 'en');

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
    t.test('fixtures match generated instructions', function(assert) {
        var v5Instructions = instructions('v5', process.env.LANGUAGE || 'en');
        var basePath = path.join(__dirname, 'fixtures', 'v5/');

        fs.readdirSync(basePath).forEach(function(type) {
            if (type.match(/^\./)) return; // ignore temporary files

            fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
                if (!file.match(/\.json$/)) return;

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
