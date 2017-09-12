var path = require('path');
var fs = require('fs');
var tape = require('tape');

var compiler = require('../index');
var languages = require('../languages');
var instructions = languages.instructions;

tape.test('v5 tokenize', function(assert) {
    var v5Compiler = compiler('v5');

    var tokenString = 'Can {first} {second}';

    var hasBoth = v5Compiler.tokenize('en', tokenString, {
        first: 'osrm',
        second: 'do routing'
    });
    assert.equal(hasBoth, 'Can osrm do routing', 'does find and replace');

    var hasFirst = v5Compiler.tokenize('en', tokenString, {
        first: 'osrm',
        second: ''
    });
    assert.equal(hasFirst, 'Can osrm ', 'does find and replace and does not drop trailing spaces');

    var hasSecond = v5Compiler.tokenize('en', tokenString, {
        second: 'swim',
        first: ''
    });
    assert.equal(hasSecond, 'Can swim', 'does find and replace and drops internal extra spaces');

    var missingSecond = v5Compiler.tokenize('en', tokenString, {
        first: 'osrm'
    });
    assert.equal(missingSecond, 'Can osrm {second}', 'does not replace tokens which are not provided');


    assert.end();
});

tape.test('v5 directionFromDegree', function(assert) {
    var v5Compiler = compiler('v5');

    assert.equal(
        v5Compiler.directionFromDegree('en', undefined), // eslint-disable-line no-undefined
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
            v5Compiler.directionFromDegree('en', d[0]),
            d[1],
            `${d[0]} degrees is ${d[1]}`
        );
    });

    assert.throws(
        () => { v5Compiler.directionFromDegree('en', 361); },
        'throws on out of bounds degree'
    );

    assert.end();
});

tape.test('v5 laneDiagram', function(assert) {
    var v5Compiler = compiler('v5');

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
        assert.equal(v5Compiler.laneConfig(makeStep(c[0])), c[1], `correct Diagram ${c[1]}`);
    });

    assert.throws(
        () => { v5Compiler.laneConfig({}); },
        'throws on non-existing intersections'
    );

    assert.throws(
        () => {
            v5Compiler.laneConfig({
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
    t.test('throws an error if no language code provided', function(assert) {
        var v5Compiler = compiler('v5');

        assert.throws(function() {
            v5Compiler.compile();
        }, /No language code provided/
    );

        assert.end();
    });

    t.test('throws an error if a non supported language code is provided', function(assert) {
        var v5Compiler = compiler('v5');

        assert.throws(function() {
            v5Compiler.compile('foo');
        }, /language code foo not loaded/
    );

        assert.end();
    });

    t.test('respects options.instructionStringHook', function(assert) {
        var v5Compiler = compiler('v5', {
            hooks: {
                tokenizedInstruction: function(instruction) {
                    return instruction.replace('{way_name}', '<blink>{way_name}</blink>');
                }
            }
        });

        assert.equal(v5Compiler.compile('en', {
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
        var version = 'v5';
        var instructionsPerLanguage = compiler(version);

        var basePath = path.join(__dirname, 'fixtures', version);

        fs.readdirSync(basePath).forEach(function(type) {
            if (type.match(/^\./)) return; // ignore temporary files

            if (type === 'phrase') {
                fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
                    if (!file.match(/\.json$/)) return;

                    var p = path.join(basePath, type, file);
                    var fixture = JSON.parse(fs.readFileSync(p));
                    var phrase = file.replace(/\..*/, '').replace(/_/g, ' ');
                    var options;
                    if (fixture.options) {
                        options = {
                            'instruction_one': fixture.options.instruction_one,
                            'instruction_two': fixture.options.instruction_two,
                            distance: fixture.options.distance
                        };
                    }

                    Object.keys(fixture.phrases).forEach((l) => {
                        assert.equal(
                            instructionsPerLanguage.tokenize(l, instructions[l][version].phrase[phrase], options),
                            fixture.phrases[l],
                            `${type}/${file}/${l}`
                        );
                    });
                });
            } else {
                fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
                    if (!file.match(/\.json$/)) return;

                    var p = path.join(basePath, type, file);
                    var fixture = JSON.parse(fs.readFileSync(p));
                    var options;
                    if (fixture.options) {
                        options = {};
                        options.legIndex = fixture.options.legIndex;
                        options.legCount = fixture.options.legCount;
                        options.classes = fixture.options.classes;
                    }

                    Object.keys(fixture.instructions).forEach((l) => {
                        assert.equal(
                            instructionsPerLanguage.compile(l, fixture.step, options),
                            fixture.instructions[l],
                            `${type}/${file}/${l}`
                        );
                    });
                });
            }
        });

        assert.end();
    });
});
