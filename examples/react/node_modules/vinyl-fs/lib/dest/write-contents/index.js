'use strict';

var through = require('through2');

var writeDir = require('./write-dir');
var writeStream = require('./write-stream');
var writeBuffer = require('./write-buffer');
var writeSymbolicLink = require('./write-symbolic-link');

var fo = require('../../file-operations');

function writeContents(optResolver) {

  function writeFile(file, enc, callback) {
    // Write it as a symlink
    if (file.isSymbolic()) {
      return writeSymbolicLink(file, optResolver, onWritten);
    }

    // If directory then mkdirp it
    if (file.isDirectory()) {
      return writeDir(file, optResolver, onWritten);
    }

    // Stream it to disk yo
    if (file.isStream()) {
      return writeStream(file, optResolver, onWritten);
    }

    // Write it like normal
    if (file.isBuffer()) {
      return writeBuffer(file, optResolver, onWritten);
    }

    // If no contents then do nothing
    if (file.isNull()) {
      return onWritten();
    }

    // This is invoked by the various writeXxx modules when they've finished
    // writing the contents.
    function onWritten(writeErr) {
      var flags = fo.getFlags({
        overwrite: optResolver.resolve('overwrite', file),
        append: optResolver.resolve('append', file),
      });
      if (fo.isFatalOverwriteError(writeErr, flags)) {
        return callback(writeErr);
      }

      callback(null, file);
    }

  }

  return through.obj(writeFile);
}

module.exports = writeContents;
