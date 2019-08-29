// Add grammar option to {way_name} depending on phrase context

var replaces = [
    ['Hold +\{modifier\}', '{modifier:fork}'], // eslint-disable-line no-useless-escape
    ['Drej +\{modifier\}', '{modifier:turn}']  // eslint-disable-line no-useless-escape
];

function optionize(phrase) {
    var result = phrase;
    replaces.forEach(function(pattern) {
        var re = new RegExp(pattern[0], 'gi');
        result = result.replace(re, pattern[1]);
    });

    return result;
}

function iterate(values) {
    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (typeof value === 'string') {
            values[key] = optionize(value);
        } else if (typeof value === 'object') {
            iterate(value);
        }
    });
}

module.exports = function(content) {
    // Iterate all content string values recursively
    iterate(content.v5);

    return content;
};
