var tape = require('tape');

var languages = require('../languages');

tape.test('verify language files structure', function(assert) {
    // check that language files have about the same structure as
    // the reference english language file
    var translations = languages.instructions;
    var english = translations.en;

    Object.keys(translations).forEach((l) => {
        if (l === 'en') return; // do not need to compare to self
        var translation = translations[l];

        assert.deepEqual(
            Object.keys(translation.v5),
            Object.keys(translations.en.v5),
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
