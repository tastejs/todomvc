'use strict';

var fo = require('../../file-operations');

function writeBuffer(file, optResolver, onWritten) {
  var flags = fo.getFlags({
    overwrite: optResolver.resolve('overwrite', file),
    append: optResolver.resolve('append', file),
  });
  var opt = {
    mode: file.stat.mode,
    flags: flags,
  };

  fo.writeFile(file.path, file.contents, opt, onWriteFile);

  function onWriteFile(writeErr, fd) {
    if (writeErr) {
      return fo.closeFd(writeErr, fd, onWritten);
    }

    fo.updateMetadata(fd, file, onUpdate);

    function onUpdate(updateErr) {
      fo.closeFd(updateErr, fd, onWritten);
    }
  }

}

module.exports = writeBuffer;
