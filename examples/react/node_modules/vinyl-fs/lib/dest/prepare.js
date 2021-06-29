'use strict';

var path = require('path');

var fs = require('graceful-fs');
var Vinyl = require('vinyl');
var through = require('through2');

function prepareWrite(folderResolver, optResolver) {
  if (!folderResolver) {
    throw new Error('Invalid output folder');
  }

  function normalize(file, enc, cb) {
    if (!Vinyl.isVinyl(file)) {
      return cb(new Error('Received a non-Vinyl object in `dest()`'));
    }

    // TODO: Remove this after people upgrade vinyl/transition from gulp-util
    if (typeof file.isSymbolic !== 'function') {
      file = new Vinyl(file);
    }

    var outFolderPath = folderResolver.resolve('outFolder', file);
    if (!outFolderPath) {
      return cb(new Error('Invalid output folder'));
    }
    var cwd = path.resolve(optResolver.resolve('cwd', file));
    var basePath = path.resolve(cwd, outFolderPath);
    var writePath = path.resolve(basePath, file.relative);

    // Wire up new properties
    file.cwd = cwd;
    file.base = basePath;
    file.path = writePath;
    if (!file.isSymbolic()) {
      var mode = optResolver.resolve('mode', file);
      file.stat = (file.stat || new fs.Stats());
      file.stat.mode = mode;
    }

    cb(null, file);
  }

  return through.obj(normalize);
}

module.exports = prepareWrite;
