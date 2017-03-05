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
`language` | required | `en` `de` `zh-Hans` `fr` `nl` `ru` | Language identifier
`options.hooks.tokenizedInstruction` | optional | `function(instruction)` | A function to change the raw instruction string before tokens are replaced. Useful to inject custom markup for tokens

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

Fixtures are programatically created and updated via `test/fixtures_test`. To update the instructions in the fixture files, run `UPDATE=1 npm test`. To create new fixtures, add them to `test/fixtures_test`, then run `UPDATE=1 npm test`.

#### Translations

The main language of this project is English `en`. We support other languages via translations, as seen in `languages/translations`.

You can help translating on the web via [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/)

To add an own translations:

- Go to [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/) and create the new translation there
- When the translation on Transifex is ready, pull in the translation file:
  - Create an empty translation file `echo "{}" > languages/translations/{language_tag}.json`
  - Add the new translation file and language tag to `./languages.js`
  - If needed: make overrides in `languages/overrides/{language_tag}.json`
  - `npm run transifex`
- Generate fixture strings for the tests via `UPDATE=1 npm test` (see changes in `git diff`)
- Make a PR

#### Release

- `git checkout master`
- Update CHANGELOG.md
- Bump version in package.json
- `git commit -am "vx.y.z"` with Changelog list in commit message
- `git tag vx.y.z -a` with Changelog list in tag message
- `git push origin master; git push origin --tags`
- `npm publish`
