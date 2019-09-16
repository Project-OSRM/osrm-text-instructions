# Change Log
All notable changes to this project will be documented in this file. For change log formatting, see http://keepachangelog.com/

## master


## 0.13.4 2019-09-16

- Added a Yoruba localization. [#284](https://github.com/Project-OSRM/osrm-text-instructions/pull/284)
- Renamed “traffic circle” to “roundabout” in the English localization. [#285](https://github.com/Project-OSRM/osrm-text-instructions/pull/285)
- Rewrote the Burmese localization. [#282](https://github.com/Project-OSRM/osrm-text-instructions/pull/282)
- Fixed typographical errors in Italian. [#281](https://github.com/Project-OSRM/osrm-text-instructions/pull/281)
- Fixed grammatical errors in Danish. [#286](https://github.com/Project-OSRM/osrm-text-instructions/pull/286)

## 0.13.3 2019-03-29

- Added a Hungarian localization and grammar. [#274](https://github.com/Project-OSRM/osrm-text-instructions/pull/274)
- Added a Japanese localization. [#277](https://github.com/Project-OSRM/osrm-text-instructions/pull/277)
- Added an Arabic localization. [#267](https://github.com/Project-OSRM/osrm-text-instructions/pull/267)
- Added a Slovenian localization. [#264](https://github.com/Project-OSRM/osrm-text-instructions/pull/264)
- Updated Russian arrive instructions. [#278](https://github.com/Project-OSRM/osrm-text-instructions/pull/278)
- Updated French grammar with 'chaussée' status street name and better articles matching. [#268](https://github.com/Project-OSRM/osrm-text-instructions/pull/268)[#279](https://github.com/Project-OSRM/osrm-text-instructions/pull/279)

## 0.13.2 2018-08-13

- Added a Norwegian Bokmål localization. [#261](https://github.com/Project-OSRM/osrm-text-instructions/pull/261)
- Updated Russian grammar with 'glade' status street name. [#259](https://github.com/Project-OSRM/osrm-text-instructions/pull/259)
- Updated Dutch translations. [#262](https://github.com/Project-OSRM/osrm-text-instructions/pull/262)

## 0.13.1 2018-07-19

- Updated French localization with articles and prepositions insertion using grammar rules. [#252](https://github.com/Project-OSRM/osrm-text-instructions/pull/252)
- Added a Burmese localization. [#247](https://github.com/Project-OSRM/osrm-text-instructions/pull/247)
- Added a Finnish localization. [#239](https://github.com/Project-OSRM/osrm-text-instructions/pull/239)
- Added a Korean localization. [#243](https://github.com/Project-OSRM/osrm-text-instructions/pull/243)
- Updated translations in Simplified Chinese. [#233](https://github.com/Project-OSRM/osrm-text-instructions/pull/233) [#248](https://github.com/Project-OSRM/osrm-text-instructions/pull/248)
- Updated Russian grammar with 'chord' status street name. [#245](https://github.com/Project-OSRM/osrm-text-instructions/pull/245)
- Added Russian church names abbreviations. [#237](https://github.com/Project-OSRM/osrm-text-instructions/pull/237)
- Corrected Lithuanian streets abbreviations. [#238](https://github.com/Project-OSRM/osrm-text-instructions/pull/238)

## 0.13.0 2018-04-11

- Added a European Portuguese localization. [#229](https://github.com/Project-OSRM/osrm-text-instructions/pull/229)
- The Spanish localization now uses the informal imperative form instead of the formal imperative form, for consistency with the Castillian Spanish localization. [#230](https://github.com/Project-OSRM/osrm-text-instructions/pull/230)
- Added some abbreviations in German, Hebrew, Hungarian, Slovenian, and Ukrainian. [#226](https://github.com/Project-OSRM/osrm-text-instructions/pull/226)
- Added support for named waypoints in arrival instructions. [#235](https://github.com/Project-OSRM/osrm-text-instructions/pull/235)

## 0.12.0 2018-02-26

- Added abbreviations for multiple languages. [#221](https://github.com/Project-OSRM/osrm-text-instructions/pull/221)
- Updated translations in German. [#220](https://github.com/Project-OSRM/osrm-text-instructions/pull/220)

## 0.11.5 2018-02-08

- Added "exit with number" to phrases. [#217](https://github.com/Project-OSRM/osrm-text-instructions/pull/217)

## 0.11.4 2018-01-29

- Added a Hebrew localization. [#210](https://github.com/Project-OSRM/osrm-text-instructions/pull/210)
- Added a Danish localization. [#208](https://github.com/Project-OSRM/osrm-text-instructions/pull/207)
- Extended ordinals support for Russian street names in grammar rules. [#192](https://github.com/Project-OSRM/osrm-text-instructions/pull/192)

## 0.11.3 2018-01-12

- Added a new phrase for a short arrival and short upcoming arrival case. [#207](https://github.com/Project-OSRM/osrm-text-instructions/pull/207)

## 0.11.2 2018-01-10

- Changed the phrases for forks to just say "Keep left onto [wayname]" (unless we have no information, in which case we still say "Keep left at the fork"). [#205](https://github.com/Project-OSRM/osrm-text-instructions/pull/205)

## 0.11.1 2018-01-02

- Changed the phrases for roundabout turns to match turns at standard intersections. [#203](https://github.com/Project-OSRM/osrm-text-instructions/pull/203)

## 0.11.0 2017-12-13

- Fixed inconsistent destinations when a ramp leads to multiple routes towards multiple places. [#197](https://github.com/Project-OSRM/osrm-text-instructions/pull/197)
- Removed left/right for off ramps unless it doesn't match driving side. [#199](https://github.com/Project-OSRM/osrm-text-instructions/pull/199)

## 0.10.7 2017-12-05

- Fixed issue preventing `formatToken` from being called on refs or names when the way has only a ref or a name. [#193](https://github.com/Project-OSRM/osrm-text-instructions/pull/193)

## 0.10.6 2017-11-10

- Updated translations in Esperanto, French, Portuguese, Russian, and Spanish. [#189](https://github.com/Project-OSRM/osrm-text-instructions/pull/189)
- Corrected punctuation in the Russian localization. [#176](https://github.com/Project-OSRM/osrm-text-instructions/pull/176)

## 0.10.5 2017-10-27

- Added a `merge straight` instruction. [#183](https://github.com/Project-OSRM/osrm-text-instructions/pull/183)
- Added new untranslated Swedish strings related to roundabouts and rotary. [#186](https://github.com/Project-OSRM/osrm-text-instructions/pull/186)

## 0.10.4 2017-10-26

- Add a phrase for an upcoming arrival step. [#184](https://github.com/Project-OSRM/osrm-text-instructions/pull/184)

## 0.10.3 2017-10-24

- Change the default exit roundabout instruction to be `exit the traffic circle`. [#182](https://github.com/Project-OSRM/osrm-text-instructions/pull/182)

## 0.10.2 2017-10-24

- Change the default exit rotary instruction to be `exit the traffic circle`. [#181](https://github.com/Project-OSRM/osrm-text-instructions/pull/181)

## 0.10.1 2017-10-19

- Simplify roundabout and rotary instructions for US usecase. Will need an GB version of en.json now. [#179](https://github.com/Project-OSRM/osrm-text-instructions/pull/179)
- Clean up Russian roundabout and rotary instructions. [#174](https://github.com/Project-OSRM/osrm-text-instructions/pull/174)

## 0.10.0 2017-10-18

- Added a `formatToken` option to `compile`, `getWayName`, and `tokenize` that allows you to manipulate any token value after any grammar or capitalization rules are applied but before the value is inserted into the instruction. [#170](https://github.com/Project-OSRM/osrm-text-instructions/pull/170)
- Removed the `options` parameter to this module, including the `tokenizedInstruction` hook. Use the `formatToken` option instead. [#170](https://github.com/Project-OSRM/osrm-text-instructions/pull/170)
- Added `namedistance` option to the depart instructions and added tests for `namedistance` in depart and continue instructions. Some typo fixes. [#177](https://github.com/Project-OSRM/osrm-text-instructions/pull/177#discussion_r145279715)

## 0.9.0 2017-10-05

- Added `getBestMatchingLanguage` for determining the closest available language. Pass a user locale into this method before passing the return value into `compile`. [#168](https://github.com/Project-OSRM/osrm-text-instructions/pull/168)

## 0.8.0 2017-10-04

- Added grammatical cases support for Russian way names. [#102](https://github.com/Project-OSRM/osrm-text-instructions/pull/102)
- Adds `osrmti.getWayName` to the public API. You MUST NOT change the result before passing it into `osrmti.tokenize`. [#167](https://github.com/Project-OSRM/osrm-text-instructions/pull/167)

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
- Updates language files from Transifex. [#144](https://github.com/Project-OSRM/osrm-text-instructions/pull/144). [#154](https://github.com/Project-OSRM/osrm-text-instructions/pull/154)

## 0.6.0 2017-09-06

- Adds `phrase` types to the English localiztion. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Adds `distance`, `name` and `namedistance` options to the continue and continue straight instructions. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Adds `tokenize` to the top level API so that external users can fill in osrm-text-instructions template strings. [#141](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Made the format of name-and-ref combinations localizable. [#148](https://github.com/Project-OSRM/osrm-text-instructions/pull/141)
- Improves the wording of "continue" instructions. [#142](https://github.com/Project-OSRM/osrm-text-instructions/pull/142)

## 0.5.3 2017-08-25

- Adds Brazilian Portuguese, Italian, and Ukrainian localizations. [#137](https://github.com/Project-OSRM/osrm-text-instructions/pull/137)
- Adds the word “right” to right-hand exit instructions. [#125](https://github.com/Project-OSRM/osrm-text-instructions/pull/125)
- Improves the wording of “continue straight” instructions. [#130](https://github.com/Project-OSRM/osrm-text-instructions/pull/130)
- Improves the wording of various instructions in Russian and Swedish. [#138](https://github.com/Project-OSRM/osrm-text-instructions/pull/138). [#137](https://github.com/Project-OSRM/osrm-text-instructions/pull/137)
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

- Improve Chinese translation
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
