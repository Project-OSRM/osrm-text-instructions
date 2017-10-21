const tape = require('tape');
const laneConfig = require('../lib/lane_config');

tape('v5 laneDiagram', function(assert) {
  [
    [[true, true, true], 'o'],
    [[true, true, false], 'ox'],
    [[true, true, false, false], 'ox'],
    [[true, false, true], 'oxo'],
    [[false, true, true, false], 'xox'],
    [[false, true, false, true, false], 'xoxox'],
    [[false, false, false], 'x']
  ].forEach(c => {
    assert.equal(laneConfig(makeStep(c[0])), c[1], `correct Diagram ${c[1]}`);
  });

  assert.throws(() => {
    laneConfig({});
  }, 'throws on non-existing intersections');

  assert.throws(() => {
    laneConfig({
      intersections: [{}]
    });
  }, 'throws on non-existing lanes');

  assert.end();
});

function makeStep(config) {
  return {
    intersections: [
      {
        lanes: config.map(v => ({ valid: v }))
      }
    ]
  };
}
