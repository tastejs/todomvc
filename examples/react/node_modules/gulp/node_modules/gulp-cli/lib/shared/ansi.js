'use strict';

var colors = require('ansi-colors');
var supportsColor = require('color-support');

var hasColors = colorize();

/* istanbul ignore next */
module.exports = {
  red: hasColors ? colors.red : noColor,
  green: hasColors ? colors.green : noColor,
  blue: hasColors ? colors.blue : noColor,
  magenta: hasColors ? colors.magenta : noColor,
  cyan: hasColors ? colors.cyan : noColor,
  white: hasColors ? colors.white : noColor,
  gray: hasColors ? colors.gray : noColor,
  bgred: hasColors ? colors.bgred : noColor,
  bold: hasColors ? colors.bold : noColor,
  yellow: hasColors ? colors.yellow : noColor,
};

function noColor(message) {
  return message;
}

function hasFlag(flag) {
  return (process.argv.indexOf('--' + flag) !== -1);
}

function colorize() {
  if (hasFlag('no-color')) {
    return false;
  }

  /* istanbul ignore if */
  if (hasFlag('color')) {
    return true;
  }

  return supportsColor();
}
