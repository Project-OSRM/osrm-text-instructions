var languages = require('../languages');

module.exports = function(language) {
  if (languages.instructions[language]) return language;

  var codes = languages.parseLanguageIntoCodes(language);
  var languageCode = codes.language;
  var scriptCode = codes.script;
  var regionCode = codes.region;

  // Same language code and script code (lng-Scpt)
  if (languages.instructions[languageCode + '-' + scriptCode]) {
    return languageCode + '-' + scriptCode;
  }

  // Same language code and region code (lng-CC)
  if (languages.instructions[languageCode + '-' + regionCode]) {
    return languageCode + '-' + regionCode;
  }

  // Same language code (lng)
  if (languages.instructions[languageCode]) {
    return languageCode;
  }

  // Same language code and any script code (lng-Scpx) and the found language contains a script
  var anyScript = languages.parsedSupportedCodes.find(function(language) {
    return language.language === languageCode && language.script;
  });
  if (anyScript) {
    return anyScript.locale;
  }

  // Same language code and any region code (lng-CX)
  var anyCountry = languages.parsedSupportedCodes.find(function(language) {
    return language.language === languageCode && language.region;
  });
  if (anyCountry) {
    return anyCountry.locale;
  }

  return 'en';
};
