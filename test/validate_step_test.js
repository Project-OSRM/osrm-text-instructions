const throws = require('./throws');
const test = require('tape');
const validateStep = require('../lib/validate_step');

test('a step must have a maneuver', function(assert) {
  throws(
    assert,
    'Step is missing required attribute maneuver',
    function() {
      validateStep({});
    },
    'missing maneuver'
  );
  assert.end();
});

test('need to confirm that good values pass', function(assert) {
  assert.fail('not tested yet');
  assert.end();
});

test('a step must have a maneuver type', function(assert) {
  throws(
    assert,
    'step maneuver.type is an invalid type: undefined',
    function() {
      validateStep({ maneuver: {} });
    },
    'missing maneuver.type'
  );
  assert.end();
});

test('a step must not have an invalid maneuver.type', function(assert) {
  throws(
    assert,
    'step maneuver.type is an invalid value: bad',
    function() {
      validateStep({ maneuver: { type: 'bad' } });
    },
    'invalid maneuver.type'
  );
  assert.end();
});
