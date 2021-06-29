'use strict';

var fo = require('../../file-operations');
var readStream = require('../../src/read-contents/read-stream');

function writeStream(file, optResolver, onWritten) {
  var flags = fo.getFlags({
    overwrite: optResolver.resolve('overwrite', file),
    append: optResolver.resolve('append', file),
  });
  var opt = {
    mode: file.stat.mode,
    // TODO: need to test this
    flags: flags,
  };

  // TODO: is this the best API?
  var outStream = fo.createWriteStream(file.path, opt, onFlush);

  file.contents.once('error', onComplete);
  outStream.once('error', onComplete);
  outStream.once('finish', onComplete);

  // TODO: should this use a clone?
  file.contents.pipe(outStream);

  function onComplete(streamErr) {
    // Cleanup event handlers before closing
    file.contents.removeListener('error', onComplete);
    outStream.removeListener('error', onComplete);
    outStream.removeListener('finish', onComplete);

    // Need to guarantee the fd is closed before forwarding the error
    outStream.once('close', onClose);
    outStream.end();

    function onClose(closeErr) {
      onWritten(streamErr || closeErr);
    }
  }

  // Cleanup
  function onFlush(fd, callback) {
    // TODO: removing this before readStream because it replaces the stream
    file.contents.removeListener('error', onComplete);

    // TODO: this is doing sync stuff & the callback seems unnecessary
    // TODO: Replace the contents stream or use a clone?
    readStream(file, complete);

    function complete() {
      if (typeof fd !== 'number') {
        return callback();
      }

      fo.updateMetadata(fd, file, callback);
    }
  }

}

module.exports = writeStream;
