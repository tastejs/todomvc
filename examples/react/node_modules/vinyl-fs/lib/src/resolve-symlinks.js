'use strict';

var through = require('through2');
var fo = require('../file-operations');

function resolveSymlinks(optResolver) {

  // A stat property is exposed on file objects as a (wanted) side effect
  function resolveFile(file, enc, callback) {

    fo.reflectLinkStat(file.path, file, onReflect);

    function onReflect(statErr) {
      if (statErr) {
        return callback(statErr);
      }

      if (!file.stat.isSymbolicLink()) {
        return callback(null, file);
      }

      var resolveSymlinks = optResolver.resolve('resolveSymlinks', file);

      if (!resolveSymlinks) {
        return callback(null, file);
      }

      // Get target's stats
      fo.reflectStat(file.path, file, onReflect);
    }
  }

  return through.obj(resolveFile);
}

module.exports = resolveSymlinks;
