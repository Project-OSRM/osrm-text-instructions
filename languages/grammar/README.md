# Grammar

Many languages - all Slavic (Russian, Ukrainian, Polish, Bulgarian, etc), Finnic (Finnish, Estonian) and others - have [grammatical case feature](https://en.wikipedia.org/wiki/Grammatical_case) that could be supported in OSRM Text Instructions too.
Originally street names are being inserted into instructions as they're in OSM map - in [nominative case](https://en.wikipedia.org/wiki/Nominative_case).
To be grammatically correct, street names should be changed according to target language rules and instruction context before insertion.

Actually grammatical case applying is not the simple and obvious task due to real-life languages complexity.
It even looks so hard so, for example, all known native Russian navigation systems don't speak street names in their pronounceable route instructions at all.

But fortunately street names have restricted lexicon and naming rules and so this task could be relatively easily solved for this particular case.

## Implementation details

The quite universal and simplier solution is the changing street names with the prepared set of regular expressions grouped by required grammatical case.
The required grammatical case should be specified right in instruction's substitution variables:

- `{way_name}` and `{rotary_name}` variables in translated instructions should be appended with required grammar case name after colon: `{way_name:accusative}` for example
- This folder should contain language-specific JSON file with regular expressions for specified grammatical case:
   ```json
   {
       "v5": {
           "accusative": [
               ["^ (\\S+)ая-(\\S+)ая [Уу]лица ", " $1ую-$2ую улицу "],
               ["^ (\\S+)ая [Уу]лица ", " $1ую улицу "],
               ...
           ]
       }
   }
   ```
- All such JSON files should be registered in common [languages.js](../../languages.js)
- Instruction text formatter ([index.js](../../index.js) in this module) should:
  - check `{way_name}` and `{rotary_name}` variables for optional grammar case after colon: `{way_name:accusative}`
  - find appropriate regular expressions block for target language and specified grammar case
  - call standard [string replace with regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) for each expression in block passing result from previous call to the next; the first call should enclose original street name with whitespaces to make parsing several words inside name a bit simplier.
- Strings replacement with regular expression is available in almost all other programming language and so this should not be the problem for other code used OSRM Text Instructions' data only.
- Grammar JSON could have [regular expression flags in JS notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp):
   ```json
   {
       "meta": {
           "regExpFlags": "ig"
       }
   }
   ```
- Please note, not all JS regular expression flags could be supported in other languages.
  For example, [OSRM Text Instructions for Swift](https://github.com/Project-OSRM/osrm-text-instructions.swift/) don't support "non-global match" and so always supposes `g` flag turned on.
  So if some regular expressions suppose stopping after their match, please include `^` and/or `$` into patterns for exact matching or return "finished" string in replace expression without enclosing whitespaces.
- If there is no regular expression matched source name (that's for names from foreign country for example), original name is returned without changes.
  This is also expected behavior of standard [string replace with regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).
  And the same behavior is expected in case of missing grammar JSON file or grammar case inside it.

## Example

Russian _"Большая Монетная улица"_ street from St Petersburg (_Big Monetary Street_ in rough translation) after processing with [Russian grammar rules](ru.json) will look in following instructions as:
- _"Turn left onto `{way_name}`"_ => `ru`:_"Поверните налево на `{way_name:accusative}`"_ => _"Поверните налево на Большую Монетную улицу"_
- _"Continue onto `{way_name}`"_ => `ru`:_"Продолжите движение по `{way_name:dative}`"_ => _"Продолжите движение по Большой Монетной улице"_
- _"Make a U-turn onto `{way_name}` at the end of the road"_ => `ru`:_"Развернитесь в конце `{way_name:genitive}`"_ => _"Развернитесь в конце Большой Монетной улицы"_
- _"Make a U-turn onto `{way_name}`"_ => `ru`:_"Развернитесь на `{way_name:prepositional}`"_ => _"Развернитесь на Большой Монетной улице"_

## Design goals

- __Cross platform__ - uses the same data-driven approach as OSRM Text Instructions
- __Test suite__ - has [prepared test](../../test/grammar_test.js) to check available expressions automatically and has easily extendable language-specific names testing pattern
- __Customization__ - could be easily extended for other languages with adding new regular expressions blocks into this grammar support folder and modifying `{way_name}` and other variables in translated instructions only with necessary grammatical case labels

## Notes

- Russian regular expressions are based on [Garmin Russian TTS voices update](https://github.com/yuryleb/garmin-russian-tts-voices) project; see [file with regular expressions to apply to source text before pronouncing by TTS](https://github.com/yuryleb/garmin-russian-tts-voices/blob/master/src/Pycckuu__Milena%202.10/RULESET.TXT).
- There is another grammar-supporting module - [jquery.i18n](https://github.com/wikimedia/jquery.i18n) - but unfortunately it has very poor implementation in part of grammatical case applying and is supposed to work with single words only.
- Actually it would be great to get street names also in target language not from default OSM `name` only - there are several multi-lingual countries supporting several `name:<lang>` names for streets.
  But this the subject to address to [OSRM engine](https://github.com/Project-OSRM/osrm-backend/issues/4561).
