'use strict';

var nodeVersion = require('./node-version');

function defaultResolution(customResolution) {
  var resolution = parseInt(customResolution, 10);

  if (resolution) {
    return resolution;
  }

  return (nodeVersion.major === 0 && nodeVersion.minor <= 10) ? 1000 : 1;
}

defaultResolution.nodeVersion = nodeVersion;

module.exports = defaultResolution;
