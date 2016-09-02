var fs = require('fs');
var tape = require('tape');

var instructions = require('../index.js');

tape.test('compile', function(t) {
    t.test('turn', function(tt) {
        tt.test('left right with name', function(assert) {
            var step = {
                name: "Street Name",
                maneuver: {
                    type: "turn",
                    modifier: "right"
                }
            };

            instructions.compile(step, "5", "high", function(err, instruction) {
              assert.error(err);
              assert.equal(instruction, 'Turn right onto Street Name');
              assert.end();
            });
        });

        tt.test('left right without name', function(assert) {
            var step = {
                maneuver: {
                    type: "turn",
                    modifier: "right"
                }
            };

            instructions.compile(step, "5", "high", function(err, instruction) {
              assert.error(err);
              assert.equal(instruction, 'Turn right');
              assert.end();
            });
        });

        tt.test('left turn with name', function(assert) {
            var step = {
                name: "Street Name",
                maneuver: {
                    type: "turn",
                    modifier: "left"
                }
            };

            instructions.compile(step, "5", "high", function(err, instruction) {
              assert.error(err);
              assert.equal(instruction, 'Turn left onto Street Name');
              assert.end();
            });
        });

        tt.test('left turn without name', function(assert) {
            var step = {
                maneuver: {
                    type: "turn",
                    modifier: "left"
                }
            };

            instructions.compile(step, "5", "high", function(err, instruction) {
              assert.error(err);
              assert.equal(instruction, 'Turn left');
              assert.end();
            });
        });
    });
});
