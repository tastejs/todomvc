'use strict';

var log = require('gulplog');
var prettyTime = require('pretty-hrtime');

var ansi = require('../../../shared/ansi');
var formatError = require('../format-error');

// Wire up logging events
function logEvents(gulpInst) {

  var loggedErrors = [];

  gulpInst.on('start', function(evt) {
    /* istanbul ignore next */
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    var level = evt.branch ? 'debug' : 'info';
    log[level]('Starting', '\'' + ansi.cyan(evt.name) + '\'...');
  });

  gulpInst.on('stop', function(evt) {
    var time = prettyTime(evt.duration);
    /* istanbul ignore next */
    var level = evt.branch ? 'debug' : 'info';
    log[level](
      'Finished', '\'' + ansi.cyan(evt.name) + '\'',
      'after', ansi.magenta(time)
    );
  });

  gulpInst.on('error', function(evt) {
    var msg = formatError(evt);
    var time = prettyTime(evt.duration);
    var level = evt.branch ? 'debug' : 'error';
    log[level](
      '\'' + ansi.cyan(evt.name) + '\'',
      ansi.red('errored after'),
      ansi.magenta(time)
    );

    // If we haven't logged this before, log it and add to list
    if (loggedErrors.indexOf(evt.error) === -1) {
      log.error(msg);
      loggedErrors.push(evt.error);
    }
  });
}

module.exports = logEvents;
