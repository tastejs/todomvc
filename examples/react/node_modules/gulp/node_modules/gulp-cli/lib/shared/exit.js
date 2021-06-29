'use strict';

// Fix stdout truncation on windows
function exit(code) {
  /* istanbul ignore next */
  if (process.platform === 'win32' && process.stdout.bufferSize) {
    process.stdout.once('drain', function() {
      process.exit(code);
    });
    return;
  }
  process.exit(code);
}

module.exports = exit;
