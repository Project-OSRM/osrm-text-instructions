// Add grammar option to {way_name} depending on phrase context

var replaces = [
    [' (de )?\{destination\}', ' {destination:preposition}'], // eslint-disable-line no-useless-escape
    [' (le rond-point )?\{rotary_name\}', ' {rotary_name:rotary}'], // eslint-disable-line no-useless-escape
    [' fin (de )?(la route )?\{way_name\}', ' fin {way_name:preposition}'], // eslint-disable-line no-useless-escape
    [' \{way_name\}', ' {way_name:article}'], // eslint-disable-line no-useless-escape
    [' (à +)?\{waypoint_name\}', ' {waypoint_name:arrival}'] // eslint-disable-line no-useless-escape
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
