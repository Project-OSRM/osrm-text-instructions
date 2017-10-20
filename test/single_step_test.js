const test = function(n, f) {
  f =
    f ||
    function(assert) {
      assert.fail('not ready');
      assert.end();
    };
  require('tape')(n, f);
};
const singleStep = require('../lib/single_step');

test('takes a lang, a step object and opts and returns a string');

test('opts are optional');

test('lang must be defined');

test('doesnt take two steps');

test('default to english for lang');

test('allows overrides to set token values');

test('triggers hook for setting token values');
