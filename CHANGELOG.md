# Change Log
All notable changes to this project will be documented in this file. For change log formatting, see http://keepachangelog.com/

## Unreleased

- put future changes here

# 0.1.0 2016-11-17

- Improve chinese translation
- Standardize capitalizeFirstLetter meta key
- Change instructions object customization to options.hooks.tokenizedInstruction

# 0.0.7 2016-11-10

- Fix name of chinese translation file

# 0.0.6 2016-11-10

- Run tests per language via LANGUAGE=de npm test
- Shorter merge instructions (Merge slightly left -> Merge left)
- Numeric ordinals (1st, 2nd) instead of word ordinals (first, second)
- Use lane only has straight as modifier, so simplify instructions.json and tests
- Add French translation (thanks @guillaumerose)
- Add Dutch translation (thanks @milovanderlinden)
- Add Chinese translation (thanks @YunjieLi)

# 0.0.5 2016-10-26

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
