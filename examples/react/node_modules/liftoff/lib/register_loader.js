var rechoir = require('rechoir');

module.exports = function(eventEmitter, extensions, configPath, cwd) {
  extensions = extensions || {};

  if (typeof configPath !== 'string') {
    return;
  }

  var autoloads = rechoir.prepare(extensions, configPath, cwd, true);
  if (autoloads instanceof Error) { // Only errors
    autoloads.failures.forEach(function(failed) {
      eventEmitter.emit('requireFail', failed.moduleName, failed.error);
    });
    return;
  }

  if (!Array.isArray(autoloads)) { // Already required or no config.
    return;
  }

  var succeeded = autoloads[autoloads.length - 1];
  eventEmitter.emit('require', succeeded.moduleName, succeeded.module);
};
