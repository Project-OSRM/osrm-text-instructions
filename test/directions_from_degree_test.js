const tape = require('tape');
const directionFromDegree = require('../lib/direction_from_degree');

tape('v5 directionFromDegree', function(assert) {
  assert.equal(
    directionFromDegree('v5', 'en', undefined), // eslint-disable-line no-undefined
    '',
    'empty string for undefined'
  );

  [
    [0, 'north'],
    [1, 'north'],
    [20, 'north'],
    [21, 'northeast'],
    [69, 'northeast'],
    [70, 'east'],
    [110, 'east'],
    [111, 'southeast'],
    [159, 'southeast'],
    [160, 'south'],
    [200, 'south'],
    [201, 'southwest'],
    [249, 'southwest'],
    [250, 'west'],
    [290, 'west'],
    [291, 'northwest'],
    [339, 'northwest'],
    [340, 'north'],
    [360, 'north']
  ].forEach(d => {
    assert.equal(
      directionFromDegree('v5', 'en', d[0]),
      d[1],
      `${d[0]} degrees is ${d[1]}`
    );
  });

  assert.throws(() => {
    directionFromDegree('v5', 'en', 361);
  }, 'throws on out of bounds degree');

  assert.end();
});
