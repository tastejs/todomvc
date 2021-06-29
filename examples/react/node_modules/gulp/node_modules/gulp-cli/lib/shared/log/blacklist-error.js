'use strict';

var log = require('gulplog');

var ansi = require('../ansi');
var exit = require('../exit');

/* istanbul ignore next */
function logBlacklistError(err) {
  log.error(ansi.red('Error: failed to retrieve plugins black-list'));
  log.error(err.message); // Avoid duplicating for each version
  exit(1);
}

module.exports = logBlacklistError;
