var tape = require('tape');

var instructions = require('../index.js');
var languages = require('../languages');
const tags = Object.keys(languages.tags);

tape.test('verify language files load', function(assert) {
    var step = {
        maneuver: {
            'type': 'turn',
            'modifier': 'left'
        }
    };

    tags.forEach((t) => {
        assert.ok(instructions('v5', t).compile(step), 'has ' + t);
    });

    assert.throws(
        () => { instructions('v5', 'this-will-never-exist'); },
        'throws on non-existing language'
    );

    assert.end();
});

tape.test('verify language files structure', function(assert) {
    // check that language files have about the same structure as
    // the reference english language file
    var english = languages.get('en');

    tags.forEach((l) => {
        if (l === 'en') return; // do not need to compare to self
        var translation = languages.get(l);

        assert.deepEqual(
            Object.keys(translation.v5),
            Object.keys(english.v5),
            l + ' has correct type keys'
        );

        Object.keys(english.v5.constants).forEach((c) => {
            assert.ok(translation.v5.constants[c], l + ' has constant ' + c);
            assert.deepEqual(
                Object.keys(translation.v5.constants[c]),
                Object.keys(english.v5.constants[c]),
                l + ' has correct contant ' + c + ' keys');
        });

        assert.deepEqual(
            Object.keys(translation.v5.rotary.default),
            Object.keys(english.v5.rotary.default),
            l + ' has correct rotary variance keys'
        );
    });

    assert.end();
});
