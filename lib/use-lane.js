module.exports = function (step) {
    if (!step.intersections || !step.intersections[0].lanes) throw new Error('No lanes object');

    // Reduce any lane combination down to a string representing the lane config
    //
    // If the valid lanes look like:
    // "lanes": [
    //     {
    //         "valid": true
    //     },
    //     {
    //         "valid": true
    //     },
    //     {
    //         "valid": true
    //     },
    //     {
    //         "valid": false
    //     },
    //     {
    //         "valid": false
    //     },
    //     {
    //         "valid": true
    //     }
    // ];
    //
    // This would map to `oxo`
    // And the instruction would `Keep left or right...`

    var diagram = [];
    var currentLaneType = null;

    step.intersections[0].lanes.forEach(function (lane) {
        if (currentLaneType === null || currentLaneType !== lane.valid) {
            if (lane.valid) {
                diagram.push('o');
            } else {
                diagram.push('x');
            }
            currentLaneType = lane.valid;
        }
    });

    return diagram.join('');
};
