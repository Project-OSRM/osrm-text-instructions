// Example usage of osrm-text-instructions with TypeScript

import osrmTextInstructions = require('./index');

// Initialize the compiler for OSRM v5
const compiler = osrmTextInstructions('v5');

// Example route step data
const step: osrmTextInstructions.RouteStep = {
  maneuver: {
    type: 'turn',
    modifier: 'left',
    bearing_after: 90
  },
  name: 'Main Street',
  ref: 'A1',
  mode: 'driving',
  intersections: [
    {
      lanes: [
        { valid: false },
        { valid: true }
      ]
    }
  ]
};

// Compile options
const options: osrmTextInstructions.CompileOptions = {
  legCount: 2,
  legIndex: 0,
  classes: ['primary'],
  formatToken: (token: string, value: string) => {
    if (token === 'way_name') {
      return `<strong>${value}</strong>`;
    }
    return value;
  }
};

try {
  // Generate instruction
  const instruction = compiler.compile('en', step, options);
  console.log('Instruction:', instruction);

  // Get way name
  const wayName = compiler.getWayName('en', step, options);
  console.log('Way name:', wayName);

  // Get direction from degree
  const direction = compiler.directionFromDegree('en', 90);
  console.log('Direction:', direction);

  // Ordinalize number
  const ordinal = compiler.ordinalize('en', 1);
  console.log('Ordinal:', ordinal);

  // Generate lane configuration
  const laneConfig = compiler.laneConfig(step);
  console.log('Lane config:', laneConfig);

  // Capitalize first letter
  const capitalized = compiler.capitalizeFirstLetter('en', 'hello world');
  console.log('Capitalized:', capitalized);

  // Access abbreviations
  const abbreviations = compiler.abbreviations;
  console.log('Available abbreviations:', Object.keys(abbreviations));

} catch (error) {
  console.error('Error:', error);
}

// Example with different maneuver types
const departStep: osrmTextInstructions.RouteStep = {
  maneuver: {
    type: 'depart',
    bearing_after: 0
  },
  name: 'Start Street'
};

const arriveStep: osrmTextInstructions.RouteStep = {
  maneuver: {
    type: 'arrive',
    modifier: 'right'
  },
  name: 'Destination Avenue'
};

const roundaboutStep: osrmTextInstructions.RouteStep = {
  maneuver: {
    type: 'roundabout',
    modifier: 'right',
    exit: 2
  },
  rotary_name: 'Main Roundabout'
};

// Compile different instruction types
const departInstruction = compiler.compile('en', departStep);
const arriveInstruction = compiler.compile('en', arriveStep, { waypointName: 'Home' });
const roundaboutInstruction = compiler.compile('en', roundaboutStep);

console.log('Depart:', departInstruction);
console.log('Arrive:', arriveInstruction);
console.log('Roundabout:', roundaboutInstruction); 