# Contributing to OSRM Text Instructions

## Reporting an issue

Bug reports and feature requests are more than welcome, but please consider the following tips so we can respond to your feedback more effectively.

Before reporting a bug here, please determine whether the problem is due to OSRM Text Instructions itself or if the problem is in a related product:

* Are you currently running the [Mapbox Navigation SDK](https://www.mapbox.com/navigation-sdk/) inside an application?
  * Tap the feedback button to send feedback directly to Mapbox.
* Does the issue occur only on the [OSRM demo server](http://map.project-osrm.org/)?
  * Report the issue in the [osrm-frontend](https://github.com/Project-OSRM/osrm-frontend/) repository’s issue tracker.
* Does the issue occur only in the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)?
  * Report the issue in the [Mapbox Feedback](https://www.mapbox.com/feedback/) tool.
* Does the issue occur only when getting directions on the [OpenStreetMap](https://www.openstreetmap.org/) homepage?
  * Report the issue in the [openstreetmap-website](https://github.com/openstreetmap/openstreetmap-website/) repository’s issue tracker.

When reporting a bug in the navigation SDK itself, please provide:

* The OSRM Text Instructions version number
* The language being used, if the issue is specific to a language
* A demonstration of the problem, either a link to a route on the [OSRM demo server](http://map.project-osrm.org/) or sample code

## Opening a pull request

Pull requests are appreciated. If your PR includes any changes that would impact developers or end users, please mention those changes in the “master” section of [CHANGELOG.md](CHANGELOG.md), noting the PR number. Examples of noteworthy changes include new features, fixes for user-visible bugs, and renamed or deleted public symbols.

## Adding a new feature

The development language of this project is English (`en`). To ensure that a new feature is functional regardless of the language in use, you also need to add any strings that the feature uses to all the localizations, not just English:

* If the new string is similar to an existing string, duplicate the existing string in the same localization to fill in the missing string.
* If no existing string is similar, copy the English string to fill in the missing string.

This way, the instruction is more likely to make sense to the user even if it’s imperfect. Once the feature is merged, we rely on translators to [update their localizations](#adding-or-updating-a-localization) with better translations.

This library relies on automatically generated test fixtures to show the effect your changes have on this library’s output in each language:

* To update the instructions in the fixture files, run `UPDATE=1 npm test`.
* To create new fixtures, add them to test/fixtures_test.js, then run `UPDATE=1 npm test`.
* Integration tests based on these fixtures help to prevent unexpected regressions. Run the integration tests using `npm install && npm test`.

## Adding or updating a localization

We welcome your help in making OSRM Text Instructions available in the languages that you and your users speak. Localizations are maintained [at Transifex](https://www.transifex.com/project-osrm/osrm-text-instructions/), then committed to the [languages/](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/) folder of this repository when ready. If your language already has a translation, feel free to complete or proofread it. Otherwise, please [request your language](https://www.transifex.com/project-osrm/osrm-text-instructions/) so you can start translating. Transifex has a Web interface, so you don’t need specialized software to get started.

Once you’ve finished translating OSRM Text Instructions into a new language in Transifex, open an issue in this repository asking to pull in your localization. Or do it yourself and open a pull request with the results:

1. _(First time only.)_ Create a plain text file named transifex.auth, and it put in the root folder of this repository. (This file is ignored by Git, so you don’t need to worry about accidentally committing it.) Fill in your [Transifex credentials](https://docs.transifex.com/api/introduction#authentication):
   ```json
   {
       "user": "username",
       "pass": "password"
   }
   ```
1. _(First time only.)_ Create an empty translation file by running `echo "{}" > languages/translations/xyz.json`, where _xyz_ is a language code, such as `en`, `fil`, `pt-BR`, or `zh-Hant`.
1. _(First time only.)_ In languages.js, require the new file and add an entry for _xyz_ to the `instructions` variable.
1. Pull the translations from Transifex by running `npm run transifex`.
1. _(Optional.)_ If your language has special casing rules or you need to systematically change what’s imported from Transifex, add an override file to languages/overrides/_xyz_.json.
1. _(Optional.)_ [Add an abbreviation file](languages/abbreviations/README.md) to languages/abbreviations/_xyz_.json that determines how words in road names and place names can be abbreviated when instructions are displayed visually.
1. _(Optional.)_ [Add a grammar file](languages/grammar/README.md) to languages/grammar/_xyz_.json that specifies the declension rules to apply to road and place names in a sentence.
1. Generate test fixtures for the language by running `UPDATE=1 npm test`. Run `git diff` to inspect the changes; make sure your translations make sense in the context of a complete sentence. Once you’re satisfied with the results, commit and push your changes.

After we merge the PR containing your localization updates and release a new version of OSRM Text Instructions, the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions) will begin to accept the new language in the `language` query parameter. If you also want the OSRM demo server to display instructions in the new language, add the language to [osrm-frontend](https://github.com/Project-OSRM/osrm-frontend/).

### Related projects

Please consider also translating the following related projects, which work together with OSRM Text Instructions to give the user a complete turn-by-turn navigation experience:

* [Mapbox Navigation SDK for Android](https://www.transifex.com/mapbox/mapbox-navigation-sdk-for-android/), which adds turn-by-turn navigation functionality to an Android application, including voice instructions powered by this library ([instructions](https://github.com/mapbox/mapbox-navigation-android/#translations))
* [Mapbox Navigation SDK for iOS](https://www.transifex.com/mapbox/mapbox-navigation-ios/), the corresponding library for iOS applications ([instructions](https://github.com/mapbox/mapbox-navigation-ios/blob/master/CONTRIBUTING.md#adding-or-updating-a-localization))
  * This SDK automatically requests [voice instructions in the system language](https://github.com/mapbox/mapbox-navigation-ios/blob/master/docs/guides/Localization%20and%20Internationalization.md#spoken-instructions) if the SDK is also available in that language.
* [Mapbox Maps SDK](https://www.transifex.com/mapbox/mapbox-gl-native/), which is responsible for the map view and minor UI elements such as the compass ([instructions](https://github.com/mapbox/mapbox-gl-native/blob/master/platform/ios/DEVELOPING.md#adding-a-localization))

## Releasing a new version

1. In CHANGELOG.md, replace the “master” heading with the new version number.
1. Bump the `version` in package.json.
1. Run `git commit -a | "vx.y.z"`, including a list of changes from the changelog in the commit message.
1. Run `git tag vx.y.z -a`, including the same list in the tag message.
1. Run `git push && git push --tags` to push the changes to the repository.
1. Open a pull request, get a review, and merge to master. (master is a protected branch.)
1. Run `npm publish` to publish the package to the general public.
