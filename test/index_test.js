const tape = require('tape');
const OSRMTextInstruction = require('../');

tape(
  'returns an object with expected function attributes for valid versions',
  function(assert) {
    ['v5'].forEach(v => {
      var osrmti = OSRMTextInstruction(v);
      assert.equal(typeof osrmti.singleStep, 'function');
      assert.equal(typeof osrmti.doubleStep, 'function');
    });
    assert.end();
  }
);

tape('throws an error for invalid version', function(assert) {
  assert.throws(function() {
    OSRMTextInstruction('fail');
  }, 'does throw');
  assert.end();
});
