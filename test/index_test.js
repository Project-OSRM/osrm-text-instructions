var fs = require('fs');
var tape = require('tape');
var path = require('path');
var instructions = require('../index.js');
var constants = require('./constants');

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
                checkModifiers(type);
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
                    fs.writeFileSync(p, JSON.stringify(fixture, null, 4));
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
