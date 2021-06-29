'use strict';

var fs = require('graceful-fs');

var mkdirp = require('fs-mkdirp-stream/mkdirp');

var fo = require('../../file-operations');

function writeDir(file, optResolver, onWritten) {
  mkdirp(file.path, file.stat.mode, onMkdirp);

  function onMkdirp(mkdirpErr) {
    if (mkdirpErr) {
      return onWritten(mkdirpErr);
    }

    fs.open(file.path, 'r', onOpen);
  }

  function onOpen(openErr, fd) {
    // If we don't have access, just move along
    if (isInaccessible(openErr)) {
      return fo.closeFd(null, fd, onWritten);
    }

    if (openErr) {
      return fo.closeFd(openErr, fd, onWritten);
    }

    fo.updateMetadata(fd, file, onUpdate);

    function onUpdate(updateErr) {
      fo.closeFd(updateErr, fd, onWritten);
    }
  }

}

function isInaccessible(err) {
  if (!err) {
    return false;
  }

  if (err.code === 'EACCES') {
    return true;
  }

  return false;
}

module.exports = writeDir;
