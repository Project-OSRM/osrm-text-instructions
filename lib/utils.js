var utils = {};

utils.getDirectionFromDegree = function(step) {
    var degree = step.maneuver.bearing_after;

    if (degree === undefined || degree.constructor !== Number) {
        // return empty if no bearing_after on this step
        return [];
    } else if (degree >= 340 && degree <= 360 || degree >= 0 && degree <= 20) {
        return ['north', 'N'];
    } else if (degree > 20 && degree < 70) {
        return ['northeast', 'NE'];
    } else if (degree >= 70 && degree < 110) {
        return ['east', 'E'];
    } else if (degree >= 110 && degree <= 160) {
        return ['southeast', 'SE'];
    } else if (degree > 160 && degree <= 200) {
        return ['south', 'S'];
    } else if (degree > 200 && degree < 250) {
        return ['southwest', 'SW'];
    } else if (degree >= 250 && degree <= 290) {
        return ['west', 'W'];
    } else if (degree > 290 && degree < 340) {
        return ['northwest', 'NW'];
    } else {
        throw new Error('Degree ' + degree + ' invalid');
    }
};

module.exports = utils;
