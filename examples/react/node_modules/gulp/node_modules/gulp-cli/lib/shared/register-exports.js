'use strict';

function registerExports(gulpInst, tasks) {
  var taskNames = Object.keys(tasks);

  if (taskNames.length) {
    taskNames.forEach(register);
  }

  function register(taskName) {
    var task = tasks[taskName];

    if (typeof task !== 'function') {
      return;
    }

    gulpInst.task(task.displayName || taskName, task);
  }
}

module.exports = registerExports;
