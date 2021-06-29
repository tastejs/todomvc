'use strict';

var match = process.version.match(/v(\d+)\.(\d+)\.(\d+)/);
var nodeVersion = {
  major: parseInt(match[1], 10),
  minor: parseInt(match[2], 10),
  patch: parseInt(match[3], 10),
};

module.exports = nodeVersion;
