var languages = require('./languages');
var instructions = languages.instructions;

module.exports = function(version) {
  return {
    compile: function(language, step, options) {
      var type = step.maneuver.type;
      var modifier = step.maneuver.modifier;
      var mode = step.mode;

      if (!instructions[language][version][type]) {
        // OSRM specification assumes turn types can be added without
        // major version changes. Unknown types are to be treated as
        // type `turn` by clients
        type = 'turn';
      }

      // Use special instructions if available, otherwise `defaultinstruction`
      var instructionObject;
      if (instructions[language][version].modes[mode]) {
        instructionObject = instructions[language][version].modes[mode];
      } else if (instructions[language][version][type][modifier]) {
        instructionObject = instructions[language][version][type][modifier];
      } else {
        instructionObject = instructions[language][version][type].default;
      }

      // Special case handling
      var laneInstruction;
      switch (type) {
        case 'use lane':
          laneInstruction =
            instructions[language][version].constants.lanes[
              this.laneConfig(step)
            ];
          if (!laneInstruction) {
            // If the lane combination is not found, default to continue straight
            instructionObject =
              instructions[language][version]['use lane'].no_lanes;
          }
          break;
        case 'rotary':
        case 'roundabout':
          if (
            step.rotary_name &&
            step.maneuver.exit &&
            instructionObject.name_exit
          ) {
            instructionObject = instructionObject.name_exit;
          } else if (step.rotary_name && instructionObject.name) {
            instructionObject = instructionObject.name;
          } else if (step.maneuver.exit && instructionObject.exit) {
            instructionObject = instructionObject.exit;
          } else {
            instructionObject = instructionObject.default;
          }
          break;
        default:
        // NOOP, since no special logic for that type
      }

      // Decide way_name with special handling for name and ref
      var wayName = this.getWayName(language, step, options);

      // Decide which instruction string to use
      // Destination takes precedence over name
      var instruction;
      if (
        step.destinations &&
        step.exits &&
        instructionObject.exit_destination
      ) {
        instruction = instructionObject.exit_destination;
      } else if (step.destinations && instructionObject.destination) {
        instruction = instructionObject.destination;
      } else if (step.exits && instructionObject.exit) {
        instruction = instructionObject.exit;
      } else if (wayName && instructionObject.name) {
        instruction = instructionObject.name;
      } else {
        instruction = instructionObject.default;
      }

      var nthWaypoint =
        options &&
        options.legIndex >= 0 &&
        options.legIndex !== options.legCount - 1
          ? this.ordinalize(language, options.legIndex + 1)
          : '';

      // Replace tokens
      // NOOP if they don't exist
      var replaceTokens = {
        way_name: wayName,
        destination: (step.destinations || '').split(',')[0],
        exit: (step.exits || '').split(';')[0],
        exit_number: this.ordinalize(language, step.maneuver.exit || 1),
        rotary_name: step.rotary_name,
        lane_instruction: laneInstruction,
        modifier: instructions[language][version].constants.modifier[modifier],
        direction: this.directionFromDegree(
          language,
          step.maneuver.bearing_after
        ),
        nth: nthWaypoint
      };

      return this.tokenize(language, instruction, replaceTokens, options);
    }
  };
};
