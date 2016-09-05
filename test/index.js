var tape = require('tape');

var instructions = require('../index.js');

tape.test('compile', function(t) {
    t.test('turn', function(tt) {
        tt.test('left right with name', function(assert) {
            var step = {
                name: 'Street Name',
                maneuver: {
                    type: 'turn',
                    modifier: 'right'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Turn right onto Street Name');
                assert.end();
            });
        });

        tt.test('left right without name', function(assert) {
            var step = {
                maneuver: {
                    type: 'turn',
                    modifier: 'right'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Turn right');
                assert.end();
            });
        });

        tt.test('left turn with name', function(assert) {
            var step = {
                name: 'Street Name',
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Turn left onto Street Name');
                assert.end();
            });
        });

        tt.test('left turn without name', function(assert) {
            var step = {
                maneuver: {
                    type: 'turn',
                    modifier: 'left'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Turn left');
                assert.end();
            });
        });


        tt.test('off ramp default', function(assert) {
            var step = {
                maneuver: {
                    type: 'off ramp',
                    modifier: 'continue'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Take the ramp');
                assert.end();
            });
        });

        tt.test('off ramp non-default case', function(assert) {
            var step = {
                maneuver: {
                    type: 'off ramp',
                    modifier: 'left'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'Take the ramp on the left');
                assert.end();
            });
        });

        tt.test('roundabout turn non-default case', function(assert) {
            var step = {
                maneuver: {
                    type: 'roundabout turn',
                    modifier: 'straight'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'At the roundabout continue straight');
                assert.end();
            });
        });

        tt.test('roundabout turn non-default case', function(assert) {
            var step = {
                maneuver: {
                    type: 'roundabout turn',
                    modifier: 'right'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'At the roundabout turn right');
                assert.end();
            });
        });

        tt.test('roundabout turn default case', function(assert) {
            var step = {
                maneuver: {
                    type: 'roundabout turn',
                    modifier: 'slight right'
                }
            };

            instructions.compile(step, '5', function(err, instruction) {
                assert.error(err);
                assert.equal(instruction, 'At the roundabout make a slight right');
                assert.end();
            });
        });
    });
});
