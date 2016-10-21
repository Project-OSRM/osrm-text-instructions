var tape = require('tape');
var instructions = require('../index.js');

var languages = [
    {
        tag: 'en',
        leftTurn: 'Turn left'
    },
    {
        tag: 'de',
        leftTurn: 'Links abbiegen'
    }
];

tape.test('verify language files load', function(assert) {
    var step = {
        maneuver: {
            'type': 'turn',
            'modifier': 'left'
        }
    };

    languages.forEach((l) => {
        assert.equal(instructions('v5', l.tag).compile(step), l.leftTurn, 'has ' + l.tag);
    });

    assert.throws(
        () => { instructions('v5', 'this-will-never-exist') },
        'throws on non-existing language'
    );

    assert.end();
});


