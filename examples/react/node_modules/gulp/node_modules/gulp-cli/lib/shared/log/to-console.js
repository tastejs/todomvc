'use strict';

var fancyLog = require('fancy-log');

/* istanbul ignore next */
function noop() {}

// The sorting of the levels is
// significant.
var levels = [
  'error', // -L: Logs error events.
  'warn',  // -LL: Logs warn and error events.
  'info',  // -LLL: Logs info, warn and error events.
  'debug', // -LLLL: Logs all log levels.
];

function cleanup(log) {
  levels.forEach(removeListeners);

  function removeListeners(level) {
    if (level === 'error') {
      log.removeListener(level, noop);
      log.removeListener(level, fancyLog.error);
    } else {
      log.removeListener(level, fancyLog);
    }
  }
}

function toConsole(log, opts) {
  // Remove previous listeners to enable to call this twice.
  cleanup(log);

  // Return immediately if logging is
  // not desired.
  if (opts.tasksSimple || opts.tasksJson || opts.help || opts.version || opts.silent) {
    // Keep from crashing process when silent.
    log.on('error', noop);
    return;
  }

  // Default loglevel to info level (3).
  var loglevel = opts.logLevel || 3;

  levels
    .filter(function(item, i) {
      return i < loglevel;
    })
    .forEach(function(level) {
      if (level === 'error') {
        log.on(level, fancyLog.error);
      } else {
        log.on(level, fancyLog);
      }
    });
}

module.exports = toConsole;
