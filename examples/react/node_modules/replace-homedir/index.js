'use strict';

var path = require('path');

var homedir = require('homedir-polyfill');
var isAbsolute = require('is-absolute');
var removeTrailingSep = require('remove-trailing-separator');

function replaceHomedir(filepath, replacement) {
  if (typeof filepath !== 'string') {
    throw new Error('Path for replace-homedir must be a string.');
  }

  if (!isAbsolute(filepath)) {
    return filepath;
  }

  var home = removeTrailingSep(homedir());
  var lookupHome = home + path.sep;
  var lookupPath = removeTrailingSep(filepath) + path.sep;

  if (lookupPath.indexOf(lookupHome) !== 0) {
    return filepath;
  }

  return filepath.replace(home, replacement);
}

module.exports = replaceHomedir;
