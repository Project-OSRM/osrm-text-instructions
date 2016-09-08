var fs = require('fs');
var tape = require('tape');
var path = require('path');
var instructions = require('../index.js');
var constants = require('../lib/constants');

tape.test('v5 compile', function(t) {
    var v5Instructions = instructions('v5');

    t.test('from fixtures', function(assert) {
        var d = path.join(__dirname, 'fixtures', 'v5/');

        fs.readdirSync(d).forEach(function(folder) {
            if (folder === '.DS_Store') return;
            fs.readdirSync(d + folder).forEach(function(p) {
                if (p.match(/json$/)) {
                    var b = path.join(d, folder, p);
                    var fixture = JSON.parse(fs.readFileSync(b));

                    if (process.env.UPDATE) {
                        fixture.instruction = v5Instructions.compile(fixture.step);
                        fs.writeFileSync(b, JSON.stringify(fixture, null, 4));
                    } else {
                        assert.equal(v5Instructions.compile(fixture.step), fixture.instruction, fixture.testName);
                    }
                }
            });
        });

        assert.end();
    });

    t.test('fixture exists for every type/modifier combinations', function(assert) {
        var basePath = path.join(__dirname, 'fixtures', 'v5/');

        fs.readdirSync(basePath).forEach(function(type) {
            if (type === '.DS_Store') return;
            fs.readdirSync(basePath + type).forEach(function() {
                constants.modifiers.forEach(function(modifier) {
                    assert.ok(fs.existsSync(path.join(basePath, type, modifier.replace(' ', '_') + '.json')), type + '/' + modifier);
                });
            });
        });

        assert.end();
    });
});
