var grammars = require('../languages').grammars;

module.exports = function(version, language, name, grammar) {
  if (!language) throw new Error('No language code provided');
  // Process way/rotary name with applying grammar rules if any
  if (
    name &&
    grammar &&
    grammars &&
    grammars[language] &&
    grammars[language][version]
  ) {
    var rules = grammars[language][version][grammar];
    if (rules) {
      // Pass original name to rules' regular expressions enclosed with spaces for simplier parsing
      var n = ' ' + name + ' ';
      var flags = grammars[language].meta.regExpFlags || '';
      rules.forEach(function(rule) {
        var re = new RegExp(rule[0], flags);
        n = n.replace(re, rule[1]);
      });

      return n.trim();
    }
  }

  return name;
};
