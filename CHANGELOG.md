# Change Log
All notable changes to this project will be documented in this file. For change log formatting, see http://keepachangelog.com/

## 0.7.1 2017-09-26

- Added Castilian Spanish localization. [#163](https://github.com/Project-OSRM/osrm-text-instructions/pull/163)
- Added Esperanto localization. [#162](https://github.com/Project-OSRM/osrm-text-instructions/pull/162)
- Added Romanian localization. [#105](https://github.com/Project-OSRM/osrm-text-instructions/pull/105)
- Added Turkish localization. [#158](https://github.com/Project-OSRM/osrm-text-instructions/pull/158)
- Added a `language` argument to `capitalizeFirstLetter`, which capitalizes according to that language’s rules. [#164](https://github.com/Project-OSRM/osrm-text-instructions/pull/164)

## 0.7.0 2017-09-13

- `language` is now the first argument of `tokenize` instead of the last. [#149](https://github.com/Project-OSRM/osrm-text-instructions/pull/149)
- Added roundabout exit and rotary exit instructions. [#150](https://github.com/Project-OSRM/osrm-text-instructions/pull/150)
- Updates `continue` maneuvers in en to read as turns when the road you are staying on turns at the intersection. [#145](https://github.com/Project-OSRM/osrm-text-instructions/pull/145)
- Updates language files from Transifex. [#144](https://github.com/Project-OSRM/osrm-text-instructions/pull/144) [#154](https://github.com/Project-OSRM/osrm-text-instructions/pull/154)

## 0.6.0 2017-09-06

- Adds `phrase` types to the English localiztion. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Adds `distance`, `name` and `namedistance` options to the continue and continue straight instructions. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Adds `tokenize` to the top level api so that external users can fill in osrm-text-instructions template strings. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Made the format of name-and-ref combinations localizable. [#148](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Improves the wording of "continue" instructions. [#142](https://github.com/Project-OSRM/osrm-text-instructions/pull/142)

## 0.5.3 2017-08-25

- Adds Brazilian Portuguese, Italian, and Ukrainian localizations. [#137](https://github.com/Project-OSRM/osrm-text-instructions/pull/137)
- Adds the word “right” to right-hand exit instructions. [#125](https://github.com/Project-OSRM/osrm-text-instructions/pull/125)
- Improves the wording of “continue straight” instructions. [#130](https://github.com/Project-OSRM/osrm-text-instructions/pull/130)
- Improves the wording of various instructions in Russian and Swedish. [#138](https://github.com/Project-OSRM/osrm-text-instructions/pull/138) [#137](https://github.com/Project-OSRM/osrm-text-instructions/pull/137)
- The Spanish localization consistently uses _usted_ form. [#137](https://github.com/Project-OSRM/osrm-text-instructions/pull/137)

## 0.5.2 2017-07-25

- In cases where the `ref` contains numbers and the road class is motorway, the ref is used for the `way_name`. [#129](https://github.com/Project-OSRM/osrm-text-instructions/pull/129)

## 0.5.1 2017-07-07

- Fix exits being correctly separated (by semicolons in OSRM)

## 0.5.0 2017-07-07

- Support `exit` property on `off ramp` type
  - Curently supported languages: english, vietnamese, german
- Polish: Add translation
- German: Ausfahrt/Abbfahrt instead of Rampe, Shorten Kreisverkehr messages

## 0.4.0 2017-06-19

- Adds optional third argument to `compile`: `compile(language, step, options)`. If provided, `options` must be an object with two keys: `legIndex` and `legCount`. This information is used for making more detailed instructions when using waypoints.

## 0.3.0 2017-05-30

- Breaking API change: move language selection from module loading to `compile(language, step)`

## 0.2.1 2017-04-05

- Add Spanish translation (thanks @josek5494)
- Update Russian translation

## 0.2.0 2017-03-14

- Manage translations via Transifex
- Add Russian translation (thanks @yuryleb @oxidase)
- Add Swedish translation
- Add Vietnamese translation (thanks @1ec5)
- English: Make continue straight instructions briefer
- English: Consistify bearings to prefer simple directions
- Development: Completely automated fixture generation
- Development: Fixture instructions in all languages

## 0.1.0 2016-11-17

- Improve chinese translation
- Standardize capitalizeFirstLetter meta key
- Change instructions object customization to options.hooks.tokenizedInstruction

## 0.0.7 2016-11-10

- Fix name of chinese translation file

## 0.0.6 2016-11-10

- Run tests per language via LANGUAGE=de npm test
- Shorter merge instructions (Merge slightly left -> Merge left)
- Numeric ordinals (1st, 2nd) instead of word ordinals (first, second)
- Use lane only has straight as modifier, so simplify instructions.json and tests
- Add French translation (thanks @guillaumerose)
- Add Dutch translation (thanks @milovanderlinden)
- Add Chinese translation (thanks @YunjieLi)

## 0.0.5 2016-10-26

- Add German Translation
- Put under Simplified BSD License

## 0.0.4 2016-10-20

- Fix Mapbox API inconsistency with ref/name

## 0.0.3 2016-10-19

- Better u-turn instructions
- Do not use name/destination on use lane
- Fix rotary names instruction `exit onto`
- Only mention end-of-road on uturn intructions
- Respect name and ref for way_name
- Handle ferry mode
- Allow for runtime customizations of instructions.json

## 0.0.2 2016-10-18

- Big refactoring of instructions.json, making it more verbose for localizaion
- Make all strings localizable
- Big refactoring of index.js, making it simpler
- Add destinations
- Fix rotaries name
- Remove external dependency number-to-words from js code
- Refactor use lane code

## 0.0.1 2016-09-21

- Initial release
