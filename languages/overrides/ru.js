// Add grammar option to {way_name} and {rotary_name} depending on phrase context

var replaces = [
    ['(развернитесь +на) +\{((way_name)|(rotary_name))\}', '$1 {$2:prepositional}'],
    ['(на) +\{((way_name)|(rotary_name))\} +с', '$1 {$2:prepositional} с'],
    ['(на) +\{((way_name)|(rotary_name))\} +по', '$1 {$2:prepositional} по'],
    ['(в +конце) +\{((way_name)|(rotary_name))\}', '$1 {$2:genitive}'],
    ['(по) +\{((way_name)|(rotary_name))\}', '$1 {$2:dative}'],
    ['(на) +\{((way_name)|(rotary_name))\}', '$1 {$2:accusative}']
];

function optionize(phrase) {
    var result = phrase;
    replaces.forEach(function(pattern) {
        var re = new RegExp(pattern[0], 'gi');
        result = result.replace(re, pattern[1]);
    });
    return result;
};

function iterate(values) {
    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (typeof value === 'string') {
            values[key] = optionize(value);
        } else if (typeof value === 'object') {
            iterate(value);
        }
    });
};

module.exports = function(content) {
    // Iterate all content string values recursively
    iterate(content.v5);
    return content;
};
