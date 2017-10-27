var tape = require('tape');

var languages = require('../languages');

tape.test('verify language files structure', function(assert) {
    // check that language files have about the same structure as
    // the reference english language file
    var translations = languages.instructions;
    var english = translations.en;

    assert.ok(english.v5.depart.default.namedistance, 'en.js has depart namedistance');
    assert.ok(english.v5.continue.straight.namedistance, 'en.js has continue straight namedistance');

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
                l + ' has correct constant ' + c + ' keys');
        });

        assert.deepEqual(
            Object.keys(translation.v5.rotary.default),
            Object.keys(english.v5.rotary.default),
            l + ' has correct rotary variance keys'
        );

        assert.deepEqual(
            Object.keys(translation.v5.depart.default),
            Object.keys(english.v5.depart.default),
            l + ' has correct depart namedistance keys'
        );

        assert.deepEqual(
            Object.keys(translation.v5['exit rotary'].default),
            Object.keys(english.v5['exit rotary'].default),
            l + ' has correct depart exit rotary keys'
        );

        assert.deepEqual(
          Object.keys(translation.v5.arrive.default),
          Object.keys(english.v5.arrive.default),
          l + ' has correct default upcoming arrive keys'
        );

        // exclude zh-Hans until full translation is available
        if (l !== 'zh-Hans') {
            assert.deepEqual(
                Object.keys(translation.v5.continue.straight),
                Object.keys(english.v5.continue.straight),
                l + ' has correct continue straight namedistance keys'
            );
        }

        assert.ok(translation.v5.merge.straight, l + ' has merge straight key');

    });

    assert.end();
});

/* eslint-disable */
tape.test('parseLanguageIntoCodes', function(t) {
    t.deepEqual(languages.parseLanguageIntoCodes('foo'), { region: undefined, language: 'fo', locale: 'fo', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('en-US'), { region: 'US', language: 'en', locale: 'en-US', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('zh-CN'), { region: 'CN', language: 'zh', locale: 'zh-CN', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('zh-Hant'),  { region: undefined, language: 'zh', locale: 'zh-Hant', script: 'Hant' });
    t.deepEqual(languages.parseLanguageIntoCodes('zh-Hant-TW'),  { region: 'TW', language: 'zh', locale: 'zh-Hant-TW', script: 'Hant' });
    t.deepEqual(languages.parseLanguageIntoCodes('zh'), { region: undefined, language: 'zh', locale: 'zh', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('es-MX'), { region: 'MX', language: 'es', locale: 'es-MX', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('es-ES'), { region: 'ES', language: 'es', locale: 'es-ES', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('pt-PT'),  { region: 'PT', language: 'pt', locale: 'pt-PT', script: undefined });
    t.deepEqual(languages.parseLanguageIntoCodes('pt'), { region: undefined, language: 'pt', locale: 'pt', script: undefined });
    t.end();
});
/* eslint-enable */
