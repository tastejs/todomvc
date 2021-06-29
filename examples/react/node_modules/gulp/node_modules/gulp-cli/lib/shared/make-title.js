'use strict';

function makeTitle(cmd, argv) {
  if (!argv || argv.length === 0) {
    return cmd;
  }

  return [cmd].concat(argv).join(' ');
}

module.exports = makeTitle;
