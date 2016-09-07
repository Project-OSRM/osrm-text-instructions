# osrm-text-instructions.js

----

__WIP: This project is under heavy development and should not be integrated yet.__

osrm-text-instructions.js is a library to transform OSRM steps into text instructions.

### Usage

```
var osrmTextInstructions = require('osrm-text-instructions')('v5');

// make your request against the API

response.legs.forEach(function(leg) {
  leg.steps.forEach(function(step) {
    instruction = osrmTextInstructions.compile(step)
  });
});
```

### Design goals

- __Customization__ Users should be able to easily fork or monkey patch the results to adjust to their own likings
- __Cross platform__ Use a translation table in JSON and few logic to allow easy implementations in other languages
- __Alarm levels__ Support different alarm levels for the complete announcement lifecycle of step
- __Localization__ Allow for translations via [Transifex](https://www.transifex.com/)
