var tape = require('tape');
var instructions = require('../index.js');
var languageInstructions = require('../instructions');

const languages = Object.keys(languageInstructions.table);
const distinctLanguages = languages
    .map((k) => {
        var v = languageInstructions.table[k];
        if (v && v.constructor === Object) {
            return k;
        } else {
            return false;
        }
    })
    .filter((l) => l);

tape.test('verify language files load', function(assert) {
    var step = {
        maneuver: {
            'type': 'turn',
            'modifier': 'left'
        }
    };

    languages.forEach((l) => {
        assert.ok(instructions('v5', l).compile(step), 'has ' + l);
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
    var english = require('../instructions').get('en');

    distinctLanguages.forEach((l) => {
        if (l === 'en') return; // do not need to compare to self
        var translation = require('../instructions').get(l);

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
