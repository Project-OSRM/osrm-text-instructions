var fs = require('fs');
var tape = require('tape');

tape.test('v5 compile', function(t) {
    var instructions = require('../index.js')('v5');

    t.test('from fixtures', (assert) => {
        var d = __dirname + '/fixtures/v5/';
        fs.readdirSync(d).forEach((f) => {
            if (f.match(/json$/)) {
                var fixture = JSON.parse(fs.readFileSync(d + f))
                assert.equal(instructions.compile(fixture.step), fixture.instruction, fixture.testName)
            }
        });

        assert.end();
    });
});
