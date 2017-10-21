const tape = require('tape');
const getWayName = require('../lib/get_way_name');

tape('v5 wayName', function(assert) {
  [
    [makeStep('', ''), ''],
    [makeStep('ref', 'name'), 'Name (ref)'],
    [makeStep('ref', 'name (ref)'), 'Name (ref)'],
    [makeStep('ref; other', 'name (ref; other)'), 'Name (ref)'],
    [makeStep('ref1; ref2', 'name'), 'Name (ref1)'],
    [makeStep('ref1; ref2', 'name (ref1; ref2)'), 'Name (ref1)']
  ].forEach((c, i) => {
    assert.equal(
      getWayName('v5', 'en', c[0]),
      c[1],
      `correct way name for non motorway test ${i}`
    );
  });

  [
    [makeStep('', ''), ''],
    [makeStep('ref', 'name'), 'name'],
    [makeStep('ref1', 'name'), 'ref1'],
    [makeStep('ref', 'name (ref)'), 'name'],
    [makeStep('ref1', 'name (ref1)'), 'ref1'],
    [makeStep('ref1; ref2', 'name'), 'ref1'],
    [makeStep('ref1; ref2', 'name (ref1; ref2)'), 'ref1']
  ].forEach((c, i) => {
    assert.equal(
      getWayName('v5', 'en', c[0], { classes: ['motorway'] }),
      c[1],
      `correct way name for motorway test ${i}`
    );
  });

  assert.throws(() => {
    getWayName();
  }, 'throws when no step is passed');

  assert.throws(() => {
    getWayName('v5', 'en', {}, { classes: 1 });
  }, 'throws when classes is invalid');

  assert.end();
});

function makeStep(ref, name) {
  return {
    ref: ref,
    name: name
  };
}
