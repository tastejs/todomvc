'use strict';

var fs = require('fs');

var log = require('gulplog');
var stdout = require('mute-stdout');

var taskTree = require('./task-tree');
var copyTree = require('../../shared/log/copy-tree');

var tildify = require('../../shared/tildify');
var logTasks = require('../../shared/log/tasks');
var ansi = require('../../shared/ansi');
var exit = require('../../shared/exit');
var logEvents = require('./log/events');
var logTasksSimple = require('./log/tasks-simple');
var registerExports = require('../../shared/register-exports');
var requireOrImport = require('../../shared/require-or-import');

function execute(opts, env, config) {
  var tasks = opts._;
  var toRun = tasks.length ? tasks : ['default'];

  if (opts.tasksSimple || opts.tasks || opts.tasksJson) {
    // Mute stdout if we are listing tasks
    stdout.mute();
  }

  // This is what actually loads up the gulpfile
  requireOrImport(env.configPath, function(err, exported) {
    // Before import(), if require() failed we got an unhandled exception on the module level.
    // So console.error() & exit() were added here to mimic the old behavior as close as possible.
    if (err) {
      console.error(err);
      exit(1);
    }

    log.info('Using gulpfile', ansi.magenta(tildify(env.configPath)));

    var gulpInst = require(env.modulePath);
    logEvents(gulpInst);

    registerExports(gulpInst, exported);

    // Always unmute stdout after gulpfile is required
    stdout.unmute();

    var tree;
    if (opts.tasksSimple) {
      return logTasksSimple(env, gulpInst);
    }
    if (opts.tasks) {
      tree = taskTree(gulpInst.tasks);
      if (config.description && typeof config.description === 'string') {
        tree.label = config.description;
      } else {
        tree.label = 'Tasks for ' + ansi.magenta(tildify(env.configPath));
      }
      return logTasks(tree, opts, function(task) {
        return gulpInst.tasks[task].fn;
      });
    }
    if (opts.tasksJson) {
      tree = taskTree(gulpInst.tasks);
      if (config.description && typeof config.description === 'string') {
        tree.label = config.description;
      } else {
        tree.label = 'Tasks for ' + tildify(env.configPath);
      }

      var output = JSON.stringify(copyTree(tree, opts));

      if (typeof opts.tasksJson === 'boolean') {
        return console.log(output);
      }

      return fs.writeFileSync(opts.tasksJson, output, 'utf-8');
    }
    gulpInst.start.apply(gulpInst, toRun);
  });
}

module.exports = execute;
