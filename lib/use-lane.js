var toWords = require('number-to-words').toWords;

// The objective here is to take a lane array of objects and
// convert it to a human readable instruction.
// First, the lane array is converted to a single string.

//
// Example
//

// lanes: [{
//     valid: true
// }, {
//     valid: false
// },{
//     valid: false
// }]

// This would be represented with the string `oxx`
// where an `o` is a valid lane and where an `x` is an invalid lane.
// From this, we can create the instruction, `Keep left...`

module.exports = function (step, instruction) {
    var laneDiagram = [];
    var allowedLanes = 0;
    var notAllowedLanes = 0;
    var numberOfPatternChanges = 0;
    var previousLane;
    var modifiedInstruction = instruction;

    if (!step.intersections || !step.intersections[0].lanes) throw new Error('No lanes object');
    step.intersections[0].lanes.forEach(function (lane) {
        if (previousLane !== lane.valid) numberOfPatternChanges += 1;
        previousLane = lane.valid;
        if (lane.valid) {
            allowedLanes += 1;
            laneDiagram.push('o');
        } else {
            notAllowedLanes += 1;
            laneDiagram.push('x');
        }
    });

    if (numberOfPatternChanges === 1) {
        modifiedInstruction = 'Take any lane and ' + modifiedInstruction.toLowerCase();
    } else if (numberOfPatternChanges === 2) {
        // xxooo vs oooxx
        var leftOrRightSide = laneDiagram[0] === 'o' ? 'left' : 'right';

        if (allowedLanes > notAllowedLanes) {
            if (laneDiagram[0] === 'o') {
                modifiedInstruction = 'Keep left and ' + modifiedInstruction.toLowerCase();
            } else {
                modifiedInstruction = 'Keep right and ' + modifiedInstruction.toLowerCase();
            }
        } else {
            modifiedInstruction = 'Use the ' + (allowedLanes > 1 ? toWords(allowedLanes) + ' ' + leftOrRightSide + ' lanes' : leftOrRightSide + ' lane') + ' and ' + modifiedInstruction.toLowerCase();
        }
    } else if (numberOfPatternChanges === 3) {
        if (laneDiagram[0] === 'o') {
            // ooxxxxo
            var allowedGroups = laneDiagram.join('').split(Array(notAllowedLanes + 1)
                .join('x'))
                .map(function (i) {
                    return i.length;
                });

            modifiedInstruction = 'Use the ' + (allowedGroups[0] > 1 ? toWords(allowedGroups[0]) + ' left lanes' : 'left lane') + ' or the ' + (allowedGroups[1] > 1 ? toWords(allowedGroups[1]) + ' right lanes' : 'right lane') + ' and ' + modifiedInstruction.toLowerCase();
        } else if (laneDiagram[0] === 'x' && laneDiagram[laneDiagram.length - 1] === 'x') {
            // Converts xxooxxx to [2, 3]
            // This represents the not allowed lane 'groups'
            var notAllowedLaneSets = laneDiagram.join('').split(Array(allowedLanes + 1).join('o'))
                .map(function (i) {
                    return i.length;
                });

            // xxoooxxx
            if (notAllowedLaneSets[0] < notAllowedLaneSets[1]) {
                modifiedInstruction = 'Use the ' + toWords(allowedLanes) + ' lanes ' + toWords(notAllowedLaneSets[0]) + ' from the left and ' + modifiedInstruction.toLowerCase();
            // xxxooxx
            } else if (notAllowedLaneSets[0] > notAllowedLaneSets[1]) {
                modifiedInstruction = 'Use the ' + toWords(allowedLanes) + ' lanes ' + toWords(notAllowedLaneSets[1]) + ' from the right and ' + modifiedInstruction.toLowerCase();
            // xox
            } else if (notAllowedLaneSets[0] === notAllowedLaneSets[1] && allowedLanes === 1) {
                modifiedInstruction = 'Use the middle lane and ' + modifiedInstruction.toLowerCase();
            // xxooxx
            } else if (notAllowedLaneSets[0] === notAllowedLaneSets[1]) {
                modifiedInstruction = 'Use the ' + toWords(allowedLanes) + ' middle lanes and ' + modifiedInstruction.toLowerCase();
            }
        } else {
            throw new Error('Unknown lane configuration: ' + laneDiagram.join(''));
        }
    } else {
        throw new Error('Unknown lane configuration: ' + laneDiagram.join(''));
    }

    return modifiedInstruction;
};
