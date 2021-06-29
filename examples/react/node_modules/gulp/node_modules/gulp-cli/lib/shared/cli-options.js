'use strict';

var ansi = require('./ansi');

module.exports = {
  help: {
    alias: 'h',
    type: 'boolean',
    desc: ansi.gray(
      'Show this help.'),
  },
  version: {
    alias: 'v',
    type: 'boolean',
    desc: ansi.gray(
      'Print the global and local gulp versions.'),
  },
  require: {
    type: 'string',
    requiresArg: true,
    desc: ansi.gray(
      'Will require a module before running the gulpfile. ' +
      'This is useful for transpilers but also has other applications.'),
  },
  gulpfile: {
    alias: 'f',
    type: 'string',
    requiresArg: true,
    desc: ansi.gray(
      'Manually set path of gulpfile. Useful if you have multiple gulpfiles. ' +
      'This will set the CWD to the gulpfile directory as well.'),
  },
  cwd: {
    type: 'string',
    requiresArg: true,
    desc: ansi.gray(
      'Manually set the CWD. The search for the gulpfile, ' +
      'as well as the relativity of all requires will be from here.'),
  },
  verify: {
    desc: ansi.gray(
      'Will verify plugins referenced in project\'s package.json against ' +
      'the plugins blacklist.'),
  },
  tasks: {
    alias: 'T',
    type: 'boolean',
    desc: ansi.gray(
      'Print the task dependency tree for the loaded gulpfile.'),
  },
  'tasks-simple': {
    type: 'boolean',
    desc: ansi.gray(
      'Print a plaintext list of tasks for the loaded gulpfile.'),
  },
  'tasks-json': {
    desc: ansi.gray(
      'Print the task dependency tree, ' +
      'in JSON format, for the loaded gulpfile.'),
  },
  'tasks-depth': {
    alias: 'depth',
    type: 'number',
    requiresArg: true,
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Specify the depth of the task dependency tree.'),
  },
  'compact-tasks': {
    type: 'boolean',
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Reduce the output of task dependency tree by printing ' +
      'only top tasks and their child tasks.'),
  },
  'sort-tasks': {
    type: 'boolean',
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Will sort top tasks of task dependency tree.'),
  },
  color: {
    type: 'boolean',
    desc: ansi.gray(
      'Will force gulp and gulp plugins to display colors, ' +
      'even when no color support is detected.'),
  },
  'no-color': {
    type: 'boolean',
    desc: ansi.gray(
      'Will force gulp and gulp plugins to not display colors, ' +
      'even when color support is detected.'),
  },
  silent: {
    alias: 'S',
    type: 'boolean',
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Suppress all gulp logging.'),
  },
  continue: {
    type: 'boolean',
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Continue execution of tasks upon failure.'),
  },
  series: {
    type: 'boolean',
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Run tasks given on the CLI in series (the default is parallel).'),
  },
  'log-level': {
    alias: 'L',
    // Type isn't needed because count acts as a boolean
    count: true,
    default: undefined,  // To detect if this cli option is specified.
    desc: ansi.gray(
      'Set the loglevel. -L for least verbose and -LLLL for most verbose. ' +
      '-LLL is default.'),
  },
};
