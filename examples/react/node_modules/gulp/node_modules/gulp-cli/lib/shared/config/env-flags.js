'use strict';

var path = require('path');
var copyProps = require('copy-props');

var toFrom = {
  configPath: 'flags.gulpfile',
  configBase: 'flags.gulpfile',
  require: 'flags.require',
  nodeFlags: 'flags.nodeFlags',
};

function mergeConfigToEnvFlags(env, config, cliOpts) {
  // This must reverse because `flags.gulpfile` determines 2 different properties
  var reverse = true;
  return copyProps(env, config, toFrom, convert, reverse);

  function convert(configInfo, envInfo) {
    if (envInfo.keyChain === 'configBase') {
      if (cliOpts.gulpfile === undefined) {
        return path.dirname(configInfo.value);
      }
      return;
    }

    if (envInfo.keyChain === 'configPath') {
      if (cliOpts.gulpfile === undefined) {
        return configInfo.value;
      }
      return;
    }

    if (envInfo.keyChain === 'require') {
      return [].concat(envInfo.value, configInfo.value);
    }

    /* istanbul ignore else */
    if (envInfo.keyChain === 'nodeFlags') {
      return [].concat(configInfo.value || []);
    }
  }
}

module.exports = mergeConfigToEnvFlags;
