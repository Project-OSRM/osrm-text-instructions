// Create a list of supported tags
var supportedTags = [
    'de',
    'en',
    'es',
    'fr',
    'id',
    'nl',
    'ru',
    'sv',
    'vi',
    'zh-Hans'
];

module.exports = {
    get: function(tags) {
        // Loads translation files for only supported and user requested tags
        var languages = {};
        tags.forEach(function(tag) {
            if (supportedTags.indexOf(tag) === -1) {
                throw 'Unsupported language tag: ' + tag;
            } else {
                languages[tag] = require('./languages/translations/' + tag + '.json');
            }
        });

        return languages;
    },
    supportedTags: supportedTags
};
