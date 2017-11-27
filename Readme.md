# OSRM Text Instructions

[![Build Status](https://travis-ci.org/Project-OSRM/osrm-text-instructions.svg?branch=master)](https://travis-ci.org/Project-OSRM/osrm-text-instructions)

----

OSRM Text Instructions transforms [OSRM](http://www.project-osrm.org/) route responses into localized text instructions. This repository contains the canonical implementation of this library written in JavaScript. OSRM Text Instructions is also available [in Swift and Objective-C](https://github.com/Project-OSRM/osrm-text-instructions.swift/) (for iOS, macOS, tvOS, and watchOS) and [in Java](https://github.com/Project-OSRM/osrm-text-instructions.java/) (for Android and Java SE).

OSRM Text Instructions has been translated into [several languages](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations/). Please help us add support for the languages you speak [using Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/).

OSRM Text Instructions could support [grammatical cases](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/Grammar.md) for street names for [some languages](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/grammar/).

Grammatical cases and other translated strings customization after [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/) is handled by [override scripts](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/overrides/).

[![NPM](https://nodei.co/npm/osrm-text-instructions.png)](https://npmjs.org/package/osrm-text-instructions/)

### Design goals

- __Cross platform__ Use a data-driven approach that makes implementations in other programming environments easy to write
- __Test suite__ Have a data-driven test suite with fixtures which can be used cross-platform
- __Translation__ Allow for translations via [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/)
- __Customization__ Users should be able to easily fork or monkey-patch the results to adjust to their own liking

### JavaScript Usage

```js
var version = 'v5';
var osrmTextInstructions = require('osrm-text-instructions')(version);

// If you’re unsure if the user’s locale is supported, use `getBestMatchingLanguage` method to find an appropriate language.
var language = osrmTextInstructions.getBestMatchingLanguage('en-US');

response.legs.forEach(function(leg) {
  leg.steps.forEach(function(step) {
    instruction = osrmTextInstructions.compile(language, step, options)
  });
});
```

#### Parameters `require('osrm-text-instructions')(version)`

parameter | required? | values | description
---|----|----|---
`version` | required | `v5` | Major OSRM version

#### Parameters `compile(language, step, options)`

parameter | required? | values | description
---|----|----|---
`language` | required | `en` `de` `zh-Hans` `fr` `nl` `ru` [and more](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations/) | Compiling instructions for the selected language code.
`step` | required | [OSRM route step object](https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#routestep-object) | The RouteStep as it comes out of OSRM
`options` | optional | Object | See [below](#options)

##### Options

key | type | description
----|----|----
`legCount` | integer | Number of legs in the route
`legIndex` | integer | Zero-based index of the leg containing the step; together with `legIndex`, this option determines whether an arrival instruction indicates which waypoint the user has arrived at
`formatToken` | function | Function that formats the given token value after grammaticalization and capitalization but before the value is inserted into the instruction string; useful for wrapping tokens in markup

`formatToken` takes two parameters:

* `token`: A string that indicates the kind of token, such as `way_name` or `direction`
* `value`: A grammatical string for this token, capitalized if the token appears at the beginning of the instruction

and returns a string.

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

The main language of this project is English `en`. We support other languages via translations, as seen in [`languages/translations`](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations/).

When adding a new instruction option, you should first provide the english use case. You should then add this use case to all other translations, opting for the closest value currently present in the target langague first and then defaulting to english if nothing acceptable is present. This way there is a better chance the instruction will make sense to the user even if its not perfect. In time translators will see this and improve it.

You can help translating on the web via [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/)

To add an own translations:

- Go to [Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/) and create the new translation there
- When the translation on Transifex is ready, pull in the translation file:
  - Create an empty translation file `echo "{}" > languages/translations/{language_code}.json`
  - Add the new translation file and language code to `./languages.js`
  - If needed: make overrides in `languages/overrides/{language_code}.json`
  - `npm run transifex`
- Generate fixture strings for the tests via `UPDATE=1 npm test` (see changes in `git diff`)
- Make a PR

#### Release

- `git checkout master`
- Update CHANGELOG.md
- Bump version in package.json
- `git commit -a | "vx.y.z"` with Changelog list in commit message
- `git tag vx.y.z -a` with Changelog list in tag message
- `git push origin master; git push origin --tags`
- `npm publish`
