var validVersions = ['v5'];

module.exports = function(version) {
  if (validVersions.indexOf(version) === -1)
    throw new Error(
      `Invalid version: ${version}. Must be ${validVersions.join(', ')}`
    );

  var api = {};

  api.singleStep = require('./lib/single_step.js').bind({ version: version });
  api.doubleStep = require('./lib/double_step.js').bind({ version: version });

  return api;
};
