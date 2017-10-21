/* eslint max-lines: "off" */
var path = require('path');
var fs = require('fs');
var tape = require('tape');

var compiler = require('../index');
var languages = require('../languages');
var instructions = languages.instructions;

tape.test('v5 laneDiagram', function(assert) {
  var v5Compiler = compiler('v5');

  function makeStep(config) {
    return {
      intersections: [
        {
          lanes: config.map(v => ({ valid: v }))
        }
      ]
    };
  }

  [
    [[true, true, true], 'o'],
    [[true, true, false], 'ox'],
    [[true, true, false, false], 'ox'],
    [[true, false, true], 'oxo'],
    [[false, true, true, false], 'xox'],
    [[false, true, false, true, false], 'xoxox'],
    [[false, false, false], 'x']
  ].forEach(c => {
    assert.equal(
      v5Compiler.laneConfig(makeStep(c[0])),
      c[1],
      `correct Diagram ${c[1]}`
    );
  });

  assert.throws(() => {
    v5Compiler.laneConfig({});
  }, 'throws on non-existing intersections');

  assert.throws(() => {
    v5Compiler.laneConfig({
      intersections: [{}]
    });
  }, 'throws on non-existing lanes');

  assert.end();
});

tape.test('v5 compile', function(t) {
  t.test('throws an error if no language code provided', function(assert) {
    var v5Compiler = compiler('v5');

    assert.throws(function() {
      v5Compiler.compile();
    }, /No language code provided/);

    assert.end();
  });

  t.test(
    'throws an error if a non supported language code is provided',
    function(assert) {
      var v5Compiler = compiler('v5');

      assert.throws(function() {
        v5Compiler.compile('foo');
      }, /language code foo not loaded/);

      assert.end();
    }
  );

  t.test('en-US fallback to en', function(assert) {
    var v5Compiler = compiler('v5');
    var language = v5Compiler.getBestMatchingLanguage('en-us');

    assert.equal(
      v5Compiler.compile(language, {
        maneuver: {
          type: 'turn',
          modifier: 'left'
        },
        name: 'Way Name'
      }),
      'Turn left onto Way Name'
    );

    assert.end();
  });

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
