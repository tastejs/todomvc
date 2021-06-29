'use strict';

var fs = require('graceful-fs');
var removeBomStream = require('remove-bom-stream');
var lazystream = require('lazystream');
var createResolver = require('resolve-options');

function streamFile(file, optResolver, onRead) {
  if (typeof optResolver === 'function') {
    onRead = optResolver;
    optResolver = createResolver();
  }

  var filePath = file.path;

  var removeBOM = optResolver.resolve('removeBOM', file);

  file.contents = new lazystream.Readable(function() {
    var contents = fs.createReadStream(filePath);

    if (removeBOM) {
      return contents.pipe(removeBomStream());
    }

    return contents;
  });

  onRead();
}

module.exports = streamFile;
