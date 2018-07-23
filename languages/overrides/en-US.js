/**
 * Recursively rename roundabouts to traffic circles like in the good old days.
 */
function iterate(values) {
    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (typeof value === 'string') {
            values[key] = value.replace(/\broundabout\b/g, 'traffic circle');
        } else if (typeof value === 'object') {
            iterate(value);
        }
    });
}

module.exports = function(content) {
    // Only call classic roundabouts (i.e., rotaries) "traffic circles".
    iterate(content.v5.rotary);
    iterate(content.v5['exit rotary']);

    return content;
};
