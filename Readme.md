# osrm-text-instructions

[![Build Status](https://travis-ci.org/Project-OSRM/osrm-text-instructions.svg?branch=master)](https://travis-ci.org/Project-OSRM/osrm-text-instructions)

----

__WIP: This project is under heavy development and should not be integrated yet.__

osrm-text-instructions transforms OSRM route responses into text instructions. It currently has only an implementation in JavaScript, with more to come.

### Design goals

- __Cross platform__ Use a data-driven approach that makes implementations in other programming environments easy to write
- __Test suite__ Have a data-driven test suite with fixtures which can be used cross-platform
- __Translation__ Allow for translations via [Transifex](https://www.transifex.com/)
- __Customization__ Users should be able to easily fork or monkey patch the results to adjust to their own likings

### Javascript Usage

```
var version = 'v5';
var language = 'en';
var options = {};
var osrmTextInstructions = require('osrm-text-instructions')(version, language, options);

// make your request against the API

response.legs.forEach(function(leg) {
  leg.steps.forEach(function(step) {
    instruction = osrmTextInstructions.compile(step)
  });
});
```

parameter | required? | values | description
---|----|----|---
`version` | required | `v5` | Major OSRM version
`language` | required | `en` `de` `zh-Hans` `fr` `nl` | Language identifier
`options.hooks.tokenizedIstruction` | optional | `function(instruction)` | A function to change the raw instruction string before tokens are replaced. Useful to inject custom markup for tokens

### Development
#### Architecture

- `index.js` holds the main transformation logic in javascript
- `instructions/` holds the translateable strings

#### Tests

Tests are data-driven integration tests for the english language.

To run them yourself for the JavaScript implementation:

```
npm install
npm test
```

##### Generate Fixtures

Fixtures can be programatically created and updated via `scripts/generate_fixtures.js`. To update the instructions in the fixture files, run `UPDATE=1 npm test`.

#### Translations

To add own translations:

- Create a new file in `instructions/`
  - base it off of `instructions/en.json`
  - use a [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) after [RFC 5646](https://en.wikipedia.org/wiki/IETF_language_tag) as name
- Translate the string values
- Add the new instructions file to `instructions.js`
- Add the new instructions file to the `languages` array in `test/instructions_test.js`
- To manually look at your changes, run `LANGUAGE=<language_tag> npm test`. This will give you failing (since untranslated) tests
- Make a PR

#### Release

- `git checkout master`
- Update CHANGELOG.md
- Bump version in package.json
- `git commit -am "vx.y.z"` with Changelog list in commit message
- `git tag vx.y.z -a` with Changelog list in tag message
- `git push origin master; git push origin --tags`
- `npm publish`
