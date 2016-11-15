var tape = require('tape');
var instructions = require('../index.js');

const languages = [
    {
        tag: 'en',
        leftTurn: 'Turn left'
    },
    {
        tag: 'de',
        leftTurn: 'Links abbiegen'
    },
    {
        tag: 'fr',
        leftTurn: 'Tourner à gauche'
    },
    {
        tag: 'nl',
        leftTurn: 'Ga linksaf'
    },
    {
        tag: 'zh',
        leftTurn: '左转'
    },
    {
        tag: 'zh-Hans',
        leftTurn: '左转'
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
        () => { instructions('v5', 'this-will-never-exist'); },
        'throws on non-existing language'
    );

    assert.end();
});

tape.test('verify language files structure', function(assert) {
    // check that language files have about the same structure as
    // the reference english language file
    var english = require('../instructions').get('en');

    languages.forEach((l) => {
        if (l.tag === 'en') return; // do not need to compare to self
        var translation = require('../instructions').get(l.tag);

        assert.deepEqual(
            Object.keys(translation.v5),
            Object.keys(english.v5),
            l.tag + ' has correct type keys'
        );

        Object.keys(english.v5.constants).forEach((c) => {
            assert.ok(translation.v5.constants[c], l.tag + ' has constant ' + c);
            assert.deepEqual(
                Object.keys(translation.v5.constants[c]),
                Object.keys(english.v5.constants[c]),
                l.tag + ' has correct contant ' + c + ' keys');
        });

        assert.deepEqual(
            Object.keys(translation.v5.rotary.default),
            Object.keys(english.v5.rotary.default),
            l.tag + ' has correct rotary variance keys'
        );
    });

    assert.end();
});
