'use strict';

var chokidar = require('chokidar');
var debounce = require('just-debounce');
var asyncDone = require('async-done');
var defaults = require('object.defaults/immutable');
var isNegatedGlob = require('is-negated-glob');
var anymatch = require('anymatch');
var normalize = require('normalize-path');

var defaultOpts = {
  delay: 200,
  events: ['add', 'change', 'unlink'],
  ignored: [],
  ignoreInitial: true,
  queue: true,
};

function listenerCount(ee, evtName) {
  if (typeof ee.listenerCount === 'function') {
    return ee.listenerCount(evtName);
  }

  return ee.listeners(evtName).length;
}

function hasErrorListener(ee) {
  return listenerCount(ee, 'error') !== 0;
}

function exists(val) {
  return val != null;
}

function watch(glob, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opt = defaults(options, defaultOpts);

  if (!Array.isArray(opt.events)) {
    opt.events = [opt.events];
  }

  if (Array.isArray(glob)) {
    // We slice so we don't mutate the passed globs array
    glob = glob.slice();
  } else {
    glob = [glob];
  }

  var queued = false;
  var running = false;

  // These use sparse arrays to keep track of the index in the
  // original globs array
  var positives = new Array(glob.length);
  var negatives = new Array(glob.length);

  // Reverse the glob here so we don't end up with a positive
  // and negative glob in position 0 after a reverse
  glob.reverse().forEach(sortGlobs);

  function sortGlobs(globString, index) {
    var result = isNegatedGlob(globString);
    if (result.negated) {
      negatives[index] = result.pattern;
    } else {
      positives[index] = result.pattern;
    }
  }

  var toWatch = positives.filter(exists);

  function joinCwd(glob) {
    if (glob && opt.cwd) {
      return normalize(opt.cwd + '/' + glob);
    }

    return glob;
  }

  // We only do add our custom `ignored` if there are some negative globs
  // TODO: I'm not sure how to test this
  if (negatives.some(exists)) {
    var normalizedPositives = positives.map(joinCwd);
    var normalizedNegatives = negatives.map(joinCwd);
    var shouldBeIgnored = function(path) {
      var positiveMatch = anymatch(normalizedPositives, path, true);
      var negativeMatch = anymatch(normalizedNegatives, path, true);
      // If negativeMatch is -1, that means it was never negated
      if (negativeMatch === -1) {
        return false;
      }

      // If the negative is "less than" the positive, that means
      // it came later in the glob array before we reversed them
      return negativeMatch < positiveMatch;
    };

    opt.ignored = [].concat(opt.ignored, shouldBeIgnored);
  }
  var watcher = chokidar.watch(toWatch, opt);

  function runComplete(err) {
    running = false;

    if (err && hasErrorListener(watcher)) {
      watcher.emit('error', err);
    }

    // If we have a run queued, start onChange again
    if (queued) {
      queued = false;
      onChange();
    }
  }

  function onChange() {
    if (running) {
      if (opt.queue) {
        queued = true;
      }
      return;
    }

    running = true;
    asyncDone(cb, runComplete);
  }

  var fn;
  if (typeof cb === 'function') {
    fn = debounce(onChange, opt.delay);
  }

  function watchEvent(eventName) {
    watcher.on(eventName, fn);
  }

  if (fn) {
    opt.events.forEach(watchEvent);
  }

  return watcher;
}

module.exports = watch;
