const tape = require('tape');
const tokenize = require('../lib/tokenize.js');

tape('v5 tokenize', function(assert) {
  var tokenString = 'Can {first} {second}';

  var hasBoth = tokenize('v5', 'en', tokenString, {
    first: 'osrm',
    second: 'do routing'
  });
  assert.equal(hasBoth, 'Can osrm do routing', 'does find and replace');

  var hasFirst = tokenize('v5', 'en', tokenString, {
    first: 'osrm',
    second: ''
  });
  assert.equal(
    hasFirst,
    'Can osrm ',
    'does find and replace and does not drop trailing spaces'
  );

  var hasSecond = tokenize('v5', 'en', tokenString, {
    second: 'swim',
    first: ''
  });
  assert.equal(
    hasSecond,
    'Can swim',
    'does find and replace and drops internal extra spaces'
  );

  var missingSecond = tokenize('v5', 'en', tokenString, {
    first: 'osrm'
  });
  assert.equal(
    missingSecond,
    'Can osrm {second}',
    'does not replace tokens which are not provided'
  );

  var formatsTokens = tokenize(
    'v5',
    'en',
    'Take me {destination}, {way_name}',
    {
      destination: 'home',
      way_name: 'Country Road'
    },
    {
      formatToken: function(token, value) {
        if (token === 'destination') {
          return '<prosody rate="slow">' + value + '</prosody>';
        }
        if (
          token === 'name' ||
          token === 'way_name' ||
          token === 'rotary_name'
        ) {
          return value.replace('Road', '<prosody rate="slow">Road</prosody>');
        }

        return value;
      }
    }
  );
  assert.equal(
    formatsTokens,
    'Take me <prosody rate="slow">home</prosody>, Country <prosody rate="slow">Road</prosody>',
    'Formats tokens'
  );

  var capitalizesTokens = tokenize(
    'v5',
    'en',
    '{modifier} turns are prohibited here',
    {
      modifier: 'left'
    },
    {
      formatToken: function(token, value) {
        if (token === 'modifier') {
          return '<strong>' + value + '</strong>';
        }

        return value;
      }
    }
  );
  assert.equal(
    capitalizesTokens,
    '<strong>Left</strong> turns are prohibited here',
    'Capitalizes tokens before formatting'
  );

  var formatsGrammaticalTokens = tokenize(
    'v5',
    'ru',
    'Плавно поверните налево на {way_name:accusative}',
    {
      way_name: 'Бармалеева улица'
    },
    {
      formatToken: function(token, value) {
        return token === 'way_name' ? value.toLocaleUpperCase('ru') : value;
      }
    }
  );
  assert.equal(
    formatsGrammaticalTokens,
    'Плавно поверните налево на БАРМАЛЕЕВУ УЛИЦУ',
    'Formats tokens after grammaticalization but before insertion'
  );

  assert.end();
});
