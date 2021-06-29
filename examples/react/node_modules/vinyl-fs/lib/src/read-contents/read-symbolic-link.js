'use strict';

var fs = require('graceful-fs');

function readLink(file, optResolver, onRead) {
  fs.readlink(file.path, onReadlink);

  function onReadlink(readErr, target) {
    if (readErr) {
      return onRead(readErr);
    }

    // Store the link target path
    file.symlink = target;

    onRead();
  }
}

module.exports = readLink;
