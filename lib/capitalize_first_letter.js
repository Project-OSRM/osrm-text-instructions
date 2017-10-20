module.exports = function(language, string) {
  return string.charAt(0).toLocaleUpperCase(language) + string.slice(1);
};
