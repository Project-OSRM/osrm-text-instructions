const throws = require('./throws');
const test = function(n, f) {
  f =
    f ||
    function(assert) {
      assert.fail('not ready');
      assert.end();
    };
  require('tape')(n, f);
};

const singleStep = require('../lib/single_step').bind({ version: 'v5' });

function createStep(type, dir) {
  return {
    maneuver: {
      type: type,
      modifier: dir
    }
  };
}

test('takes a lang, a step object and opts and returns a string', function(
  assert
) {
  var out = singleStep('en', createStep('turn', 'right'), {});
  assert.equal(out, 'Turn right', 'returned the expected string');
  assert.end();
});

test('opts are optional', function(assert) {
  var out = singleStep('en', createStep('turn', 'right'));
  assert.equal(out, 'Turn right', 'returned the expected string');
  assert.end();
});

test('lang must be defined', function(assert) {
  throws(assert, 'language must be provided', function() {
    singleStep();
  });
  assert.end();
});

test('step validation is handled by validate_step', function(assert) {
  try {
    singleStep('en', {});
    assert.fail('error not thrown an invalid step');
  } catch (err) {
    var stack = err.stack.split('\n');
    assert.ok(
      stack[1].indexOf('osrm-text-instructions/lib/validate_step.js') !== -1,
      'error stack reference the right file'
    );
  }

  assert.end();
});

test('default to english for lang', function(assert) {
  var out = singleStep('not-a-lang', createStep('turn', 'right'));
  assert.equal(out, 'Turn right', 'returned the expected string');
  assert.end();
});

test('allows overrides to set token values', function(assert) {
  var out = singleStep('en', createStep('turn', 'right'), {
    overrides: { name: 'Upper Road' }
  });
  assert.equal(out, 'Turn right onto Upper Road');
  assert.end();
});

test('triggers hook for setting token values', function(assert) {
  var onToken = function(token, value) {
    if (token === 'direction') return value.toUpperCase();
    if (token === 'name') return null;
  };
  var out = singleStep('en', createStep('turn', 'right'), {
    overrides: { name: 'Upper Road' },
    onToken: onToken
  });
  assert.equal(out, 'Turn RIGHT');
  assert.end();
});

test('remove unnesary values via options', function(assert) {
  var step = createStep('turn', 'right', 'Upper Road');
  assert.equal(
    singleStep('en', step, { overrides: { name: null } }),
    'Turn right',
    'you can drop the name via overrides'
  );

  assert.equal(
    singleStep('en', step, {
      onToken: function(token, value) {
        return token === 'name' ? null : value;
      }
    }),
    'Turn right',
    'you can drop the name via onToken'
  );

  assert.equal(
    singleStep('en', step, { overrides: { direction: null } }),
    'Turn right on Upper Road',
    'you cannot drop required attributes via overrides'
  );
  assert.equal(
    singleStep('en', step, {
      onToken: function(token, value) {
        return token === 'direction' ? null : value;
      }
    }),
    'Turn right on Upper Road',
    'you cannot drop required attributes via overrides'
  );

  assert.equal(
    singleStep('en', step, {
      overrides: { direction: null, name: null }
    }),
    'Turn right',
    'You can drop the name but not the required attribute via overrides'
  );

  assert.equal(
    singleStep('en', step, {
      onToken: function() {
        return null;
      }
    }),
    'Turn right',
    'You can drop the name but not the required attribute via overrides'
  );
  assert.end();
});
