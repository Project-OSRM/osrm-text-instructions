module.exports = function(step) {
  // Reduce any lane combination down to a contracted lane diagram
  if (!step.intersections || !step.intersections[0].lanes)
    throw new Error('No lanes object');

  var config = [];
  var currentLaneValidity = null;

  step.intersections[0].lanes.forEach(function(lane) {
    if (currentLaneValidity === null || currentLaneValidity !== lane.valid) {
      if (lane.valid) {
        config.push('o');
      } else {
        config.push('x');
      }
      currentLaneValidity = lane.valid;
    }
  });

  return config.join('');
};
