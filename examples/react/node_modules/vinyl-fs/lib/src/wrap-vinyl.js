'use strict';

var File = require('vinyl');
var through = require('through2');

function wrapVinyl() {

  function wrapFile(globFile, enc, callback) {

    var file = new File(globFile);

    callback(null, file);
  }

  return through.obj(wrapFile);
}

module.exports = wrapVinyl;
