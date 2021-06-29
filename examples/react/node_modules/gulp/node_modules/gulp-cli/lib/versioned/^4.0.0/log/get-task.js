'use strict';

var isObject = require('isobject');

function getTask(gulpInst) {
  return function(name) {
    var task = gulpInst.task(name);
    return {
      description: getDescription(task),
      flags: getFlags(task),
    };
  };
}

function getDescription(task) {
  if (typeof task.description === 'string') {
    return task.description;
  }
  /* istanbul ignore else */
  if (typeof task.unwrap === 'function') {
    var origFn = task.unwrap();
    if (typeof origFn.description === 'string') {
      return origFn.description;
    }
  }
  return undefined;
}

function getFlags(task) {
  if (isObject(task.flags)) {
    return task.flags;
  }
  /* istanbul ignore else */
  if (typeof task.unwrap === 'function') {
    var origFn = task.unwrap();
    if (isObject(origFn.flags)) {
      return origFn.flags;
    }
  }
  return undefined;
}

module.exports = getTask;
