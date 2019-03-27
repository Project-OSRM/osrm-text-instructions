// Add grammar option to {way_name} and others depending on phrase context

var replaces = [
    [' (a\\(z\\) +)?\\{((way_name)|(destination))\\} +felé', ' {$2:sublative_to}'], // eslint-disable-line no-useless-escape
    [' (a\\(z\\) +)?\\{((way_name)|(destination))\\} +irányába\\b', ' {$2:sublative_toward}'], // eslint-disable-line no-useless-escape
    [' (a\\(z\\) +)?\\{((way_name)|(destination))\\} +szakaszon\\b', ' {$2:superessive}'], // eslint-disable-line no-useless-escape
    [' a\\(z\\) +\\{(\\w+)\\}', ' {$1:article}'] // eslint-disable-line no-useless-escape
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
