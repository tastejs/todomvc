'use strict';

var log = require('gulplog');

var ansi = require('../ansi');
var exit = require('../exit');

function logVerify(blacklisted) {
  var pluginNames = Object.keys(blacklisted);

  if (!pluginNames.length) {
    log.info(
      ansi.green('There are no blacklisted plugins in this project')
    );
    exit(0);
  }

  log.warn(ansi.red('Blacklisted plugins found in this project:'));

  pluginNames.map(function(pluginName) {
    var reason = blacklisted[pluginName];
    log.warn(ansi.bgred(pluginName) + ': ' + reason);
  });

  exit(1);
}

module.exports = logVerify;
