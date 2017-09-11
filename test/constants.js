var constants = {};

constants.types = [
    'arrive',
    'continue',
    'depart',
    'end of road',
    'fork',
    'merge',
    'new name',
    'notification',
    'off ramp',
    'on ramp',
    'rotary',
    'roundabout',
    'roundabout turn',
    'exit roundabout',
    'exit rotary',
    'turn',
    'use lane'
];

constants.modifiers = [
    'left',
    'right',
    'sharp left',
    'sharp right',
    'slight left',
    'slight right',
    'straight',
    'uturn'
];

// semantic direction (also: key of translation), start bearing, end bearing
constants.directions = [
    [ 'north',     340, 20  ],
    [ 'northeast', 21,  69  ],
    [ 'east',      70,  110 ],
    [ 'southeast', 111, 159 ],
    [ 'south',     160, 200 ],
    [ 'southwest', 201, 249 ],
    [ 'west',      250, 290 ],
    [ 'northwest', 291, 339 ]
];

module.exports = constants;
