module.exports = function(assert, msg, fn, name) {
  try {
    fn();
    assert.fail('did not throw', name);
  } catch (err) {
    assert.equal(msg, err.message, name);
  }
};
