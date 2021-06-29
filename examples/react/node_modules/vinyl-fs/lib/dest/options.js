'use strict';

var config = {
  cwd: {
    type: 'string',
    default: process.cwd,
  },
  mode: {
    type: 'number',
    default: function(file) {
      return file.stat ? file.stat.mode : null;
    },
  },
  dirMode: {
    type: 'number',
  },
  overwrite: {
    type: 'boolean',
    default: true,
  },
  append: {
    type: 'boolean',
    default: false,
  },
  sourcemaps: {
    type: ['string', 'boolean'],
    default: false,
  },
  // Symlink options
  relativeSymlinks: {
    type: 'boolean',
    default: false,
  },
  // This option is ignored on non-Windows platforms
  useJunctions: {
    type: 'boolean',
    default: true,
  },
};

module.exports = config;
