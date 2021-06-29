'use strict';

var copyProps = require('copy-props');
var path = require('path');

function loadConfigFiles(configFiles, configFileOrder) {
  var config = {};

  configFileOrder.forEach(loadFile);

  function loadFile(key) {
    var filePath = configFiles[key];
    if (!filePath) {
      return;
    }

    copyProps(require(filePath), config, convert);

    function convert(loadedInfo) {
      if (loadedInfo.keyChain === 'flags.gulpfile') {
        return path.resolve(path.dirname(filePath), loadedInfo.value);
      }
      return loadedInfo.value;
    }
  }

  return config;
}

module.exports = loadConfigFiles;
