# Abbreviations

This folder contains data about abbreviations used in road names, place names, and other names that might appear in a text instruction when displayed visually to the user. Each of the JSON files in this folder corresponds to a single localization. The file is named for the language’s ISO code.

## Abbreviation file format

The file format consists of an object with three keys:

* `abbreviations`: Miscellaneous words that are frequently abbreviated in street names.
* `classifications`: [Street type designations](https://en.wikipedia.org/wiki/Street_or_road_name#Street_type_designations), such as those that appear as suffixes in English-speaking regions or prefixes in Spanish-speaking regions. Some localizations omit this key if regions that speak the language rarely include type designations in street names.
* `directions`: Cardinal or secondary direction words, typically used in localities that indicate the quadrant in street names.

In each of the three objects, the keys are fully-spelled out words, while the values are the corresponding abbreviations. For example:

```json
{
  "saint": "St",
  "street": "St"
}
```

The keys are in lowercase, to aid in case-insensitive matching, and may consist of multiple words each:

```json
{
  "centre hospitalier régional": "CHR"
}
```

Most localizations put the abbreviations in title case, for consistency with the original street names, and omit periods. The lists only include words commonly found in road names, and they only include abbreviations that a user would recognize instantly and unambiguously.

## Usage

Based on these lists, the Mapbox Navigation SDK shortens road names to fit in the turn banner at the top of the screen, starting with `directions`, then `classifications`, then finally `abbreviations` for exceptionally long names. If your application displays text instructions visually, such as in a list of steps, you can also abbreviate names in those instructions:

```js
let abbreviations = osrmTextInstructions.abbreviations.en;
let instruction = osrmTextInstructions.compile('en', step, {
  formatToken: function (token, value) {
    if (token === 'name' || token === 'rotary_name') {
      // Replace words in value based on abbreviations.
    }
    return value;
  }
});
```
