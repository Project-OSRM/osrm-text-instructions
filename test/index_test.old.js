/* eslint max-lines: "off" */
var path = require('path');
var fs = require('fs');
var tape = require('tape');

var compiler = require('../index');
var languages = require('../languages');
var instructions = languages.instructions;

tape.test('v5 compile', function(t) {
  t.test('zh-CN fallback to zh-Hans', function(assert) {
    var v5Compiler = compiler('v5');
    var language = v5Compiler.getBestMatchingLanguage('zh-CN');

    assert.equal(
      v5Compiler.compile(language, {
        maneuver: {
          type: 'turn',
          modifier: 'left'
        },
        name: 'Way Name'
      }),
      '左转，上Way Name'
    );

    assert.end();
  });

  t.test('zh-Hant fallback to zh-Hanz', function(assert) {
    var v5Compiler = compiler('v5');
    var language = v5Compiler.getBestMatchingLanguage('zh-Hant');

    assert.equal(
      v5Compiler.compile(language, {
        maneuver: {
          type: 'turn',
          modifier: 'left'
        },
        name: 'Way Name'
      }),
      '左转，上Way Name'
    );

    assert.end();
  });

  t.test('zh-Hant-TW fallback to zh-Hant', function(assert) {
    var v5Compiler = compiler('v5');
    var language = v5Compiler.getBestMatchingLanguage('zh-Hant-TW');

    assert.equal(
      v5Compiler.compile(language, {
        maneuver: {
          type: 'turn',
          modifier: 'left'
        },
        name: 'Way Name'
      }),
      '左转，上Way Name'
    );

    assert.end();
  });

  t.test('es-MX fallback to es', function(assert) {
    var v5Compiler = compiler('v5');
    var language = v5Compiler.getBestMatchingLanguage('es-MX');

    assert.equal(
      v5Compiler.compile(language, {
        maneuver: {
          type: 'turn',
          modifier: 'straight'
        },
        name: 'Way Name'
      }),
      'Ve recto en Way Name'
    );

    assert.end();
  });

  t.test('getBestMatchingLanguage', function(t) {
    t.equal(compiler('v5').getBestMatchingLanguage('foo'), 'en');
    t.equal(compiler('v5').getBestMatchingLanguage('en-US'), 'en');
    t.equal(compiler('v5').getBestMatchingLanguage('zh-CN'), 'zh-Hans');
    t.equal(compiler('v5').getBestMatchingLanguage('zh-Hant'), 'zh-Hans');
    t.equal(compiler('v5').getBestMatchingLanguage('zh-Hant-TW'), 'zh-Hans');
    t.equal(compiler('v5').getBestMatchingLanguage('zh'), 'zh-Hans');
    t.equal(compiler('v5').getBestMatchingLanguage('es-MX'), 'es');
    t.equal(compiler('v5').getBestMatchingLanguage('es-ES'), 'es-ES');
    t.equal(compiler('v5').getBestMatchingLanguage('pt-PT'), 'pt-BR');
    t.equal(compiler('v5').getBestMatchingLanguage('pt'), 'pt-BR');
    t.equal(compiler('v5').getBestMatchingLanguage('pt-pt'), 'pt-BR');
    t.end();
  });

  t.test('fixtures match generated instructions', function(assert) {
    // pre-load instructions
    var version = 'v5';
    var instructionsPerLanguage = compiler(version);

    var basePath = path.join(__dirname, 'fixtures', version);

    fs.readdirSync(basePath).forEach(function(type) {
      if (type.match(/^\./)) return; // ignore temporary files

      if (type === 'phrase') {
        fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
          if (!file.match(/\.json$/)) return;

          var p = path.join(basePath, type, file);
          var fixture = JSON.parse(fs.readFileSync(p));
          var phrase = file.replace(/\..*/, '').replace(/_/g, ' ');
          var options;
          if (fixture.options) {
            options = {
              instruction_one: fixture.options.instruction_one,
              instruction_two: fixture.options.instruction_two,
              distance: fixture.options.distance
            };
          }

          Object.keys(fixture.phrases).forEach(l => {
            assert.equal(
              instructionsPerLanguage.tokenize(
                l,
                instructions[l][version].phrase[phrase],
                options
              ),
              fixture.phrases[l],
              `${type}/${file}/${l}`
            );
          });
        });
      } else {
        fs.readdirSync(path.join(basePath, type)).forEach(function(file) {
          if (!file.match(/\.json$/)) return;

          var p = path.join(basePath, type, file);
          var fixture = JSON.parse(fs.readFileSync(p));
          var options;
          if (fixture.options) {
            options = {};
            options.legIndex = fixture.options.legIndex;
            options.legCount = fixture.options.legCount;
            options.classes = fixture.options.classes;
          }

          Object.keys(fixture.instructions).forEach(l => {
            assert.equal(
              instructionsPerLanguage.compile(l, fixture.step, options),
              fixture.instructions[l],
              `${type}/${file}/${l}`
            );
          });
        });
      }
    });

    assert.end();
  });
});
