var tape = require('tape');

var instructions = require('../index.js');
var languages = require('../languages.js');

const grammarTests = {
    'ru': [
        ['Бармалеева улица', 'accusative', 'Бармалееву улицу'],
        ['Бармалеева улица', 'dative', 'Бармалеевой улице'],
        ['Бармалеева улица', 'genitive', 'Бармалеевой улицы'],
        ['Бармалеева улица', 'prepositional', 'Бармалеевой улице'],
        ['Большая Монетная улица', 'accusative', 'Большую Монетную улицу'],
        ['Большая Монетная улица', 'dative', 'Большой Монетной улице'],
        ['Большая Монетная улица', 'genitive', 'Большой Монетной улицы'],
        ['Большая Монетная улица', 'prepositional', 'Большой Монетной улице'],
        ['Малая Зеленина улица', 'accusative', 'Малую Зеленину улицу'],
        ['Малая Зеленина улица', 'dative', 'Малой Зелениной улице'],
        ['Малая Зеленина улица', 'genitive', 'Малой Зелениной улицы'],
        ['Малая Зеленина улица', 'prepositional', 'Малой Зелениной улице'],
        ['22-23-я линии В.О.', 'accusative', '22-23-ю линии В.О.'],
        ['22-23-я линии В.О.', 'dative', '22-23-й линиям В.О.'],
        ['22-23-я линии В.О.', 'genitive', '22-23-й линий В.О.'],
        ['22-23-я линии В.О.', 'prepositional', '22-23-й линиях В.О.'],
        ['Австрийская площадь', 'accusative', 'Австрийскую площадь'],
        ['Австрийская площадь', 'dative', 'Австрийской площади'],
        ['Австрийская площадь', 'genitive', 'Австрийской площади'],
        ['Австрийская площадь', 'prepositional', 'Австрийской площади'],
        ['Лялина площадь', 'accusative', 'Лялину площадь'],
        ['Лялина площадь', 'dative', 'Лялиной площади'],
        ['Лялина площадь', 'genitive', 'Лялиной площади'],
        ['Лялина площадь', 'prepositional', 'Лялиной площади'],
        ['1-й Тверской-Ямской переулок', 'accusative', '1-й Тверской-Ямской переулок'],
        ['1-й Тверской-Ямской переулок', 'dative', '1-му Тверскому-Ямскому переулку'],
        ['1-й Тверской-Ямской переулок', 'genitive', '1-го Тверского-Ямского переулка'],
        ['1-й Тверской-Ямской переулок', 'prepositional', '1-м Тверском-Ямском переулке'],
        ['Большой Сампсониевский проспект', 'accusative', 'Большой Сампсониевский проспект'],
        ['Большой Сампсониевский проспект', 'dative', 'Большому Сампсониевскому проспекту'],
        ['Большой Сампсониевский проспект', 'genitive', 'Большого Сампсониевского проспекта'],
        ['Большой Сампсониевский проспект', 'prepositional', 'Большом Сампсониевском проспекте'],
        ['Нижний Лебяжий мост', 'accusative', 'Нижний Лебяжий мост'],
        ['Нижний Лебяжий мост', 'dative', 'Нижнему Лебяжьему мосту'],
        ['Нижний Лебяжий мост', 'genitive', 'Нижнего Лебяжьего моста'],
        ['Нижний Лебяжий мост', 'prepositional', 'Нижнем Лебяжьем мосту'],
        ['Старо-Калинкин мост', 'accusative', 'Старо-Калинкин мост'],
        ['Старо-Калинкин мост', 'dative', 'Старо-Калинкину мосту'],
        ['Старо-Калинкин мост', 'genitive', 'Старо-Калинкина моста'],
        ['Старо-Калинкин мост', 'prepositional', 'Старо-Калинкином мосту'],
        ['Тучков мост', 'accusative', 'Тучков мост'],
        ['Тучков мост', 'dative', 'Тучкову мосту'],
        ['Тучков мост', 'genitive', 'Тучкова моста'],
        ['Тучков мост', 'prepositional', 'Тучковом мосту'],
        ['Пыхов-Церковный проезд', 'accusative', 'Пыхов-Церковный проезд'],
        ['Пыхов-Церковный проезд', 'dative', 'Пыхову-Церковному проезду'],
        ['Пыхов-Церковный проезд', 'genitive', 'Пыхова-Церковного проезда'],
        ['Пыхов-Церковный проезд', 'prepositional', 'Пыховом-Церковном проезде'],
        ['Третье Транспортное кольцо', 'accusative', 'Третье Транспортное кольцо'],
        ['Третье Транспортное кольцо', 'dative', 'Третьему Транспортному кольцу'],
        ['Третье Транспортное кольцо', 'genitive', 'Третьего Транспортного кольца'],
        ['Третье Транспортное кольцо', 'prepositional', 'Третьем Транспортном кольце']
    ]
    // TODO add your language grammar tests to call grammarize() and check result
};

tape.test('verify grammar files structure', function(assert) {
    // check that grammar files have proper structure as:
    // {
    // "v5": {
    //         "grammar name": [
    //             ["regular expression", "replace string"],
    //             ...
    //     }
    // }

    Object.keys(languages.grammars).forEach((l) => {
        var grammar = languages.grammars[l];

        assert.ok(grammar.v5, l + ' grammar has v5 version');

        Object.keys(grammar.v5).forEach((g) => {
            // check each grammar case
            var r = grammar.v5[g];
            assert.ok(Array.isArray(r), l + ' grammar has rules array for ' + g);

            var i = 0;
            r.forEach((e) => {
                i++; // eslint-disable-line no-plusplus
                assert.doesNotThrow(() => {
                    var b = Array.isArray(e) && e.length === 2;
                    if (b) {
                        // all regular expressions from grammar should not match empty string
                        r = new RegExp(e[0], grammar.meta.regExpFlags);
                        b = ''.replace(r, e[1]) === '';
                    }

                    return b;
                }, true, l + ' grammar has correct rule #' + i + ' for ' + g);
            });
        });
    });

    assert.end();
});

tape.test('check grammar test data with grammarize()', function(assert) {
    // check that grammar works properly with test data

    Object.keys(grammarTests).forEach((l) => {
        var v5Instructions = instructions('v5');

        grammarTests[l].forEach((t) => {
            assert.equal(v5Instructions.grammarize(l, t[0], t[1]), t[2],
                l + ' grammar passed for "' + t[2] + '" in ' + t[1]);
        });
    });

    assert.end();
});
