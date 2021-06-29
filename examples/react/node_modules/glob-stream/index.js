'use strict';

var Combine = require('ordered-read-streams');
var unique = require('unique-stream');
var pumpify = require('pumpify');
var isNegatedGlob = require('is-negated-glob');
var extend = require('extend');

var GlobStream = require('./readable');

function globStream(globs, opt) {
  if (!opt) {
    opt = {};
  }

  var ourOpt = extend({}, opt);
  var ignore = ourOpt.ignore;

  ourOpt.cwd = typeof ourOpt.cwd === 'string' ? ourOpt.cwd : process.cwd();
  ourOpt.dot = typeof ourOpt.dot === 'boolean' ? ourOpt.dot : false;
  ourOpt.silent = typeof ourOpt.silent === 'boolean' ? ourOpt.silent : true;
  ourOpt.cwdbase = typeof ourOpt.cwdbase === 'boolean' ? ourOpt.cwdbase : false;
  ourOpt.uniqueBy =  typeof ourOpt.uniqueBy === 'string' ||
                    typeof ourOpt.uniqueBy === 'function' ? ourOpt.uniqueBy : 'path';

  if (ourOpt.cwdbase) {
    ourOpt.base = ourOpt.cwd;
  }
  // Normalize string `ignore` to array
  if (typeof ignore === 'string') {
    ignore = [ignore];
  }
  // Ensure `ignore` is an array
  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  // Only one glob no need to aggregate
  if (!Array.isArray(globs)) {
    globs = [globs];
  }

  var positives = [];
  var negatives = [];

  globs.forEach(sortGlobs);

  function sortGlobs(globString, index) {
    if (typeof globString !== 'string') {
      throw new Error('Invalid glob at index ' + index);
    }

    var glob = isNegatedGlob(globString);
    var globArray = glob.negated ? negatives : positives;

    globArray.push({
      index: index,
      glob: glob.pattern,
    });
  }

  if (positives.length === 0) {
    throw new Error('Missing positive glob');
  }

  // Create all individual streams
  var streams = positives.map(streamFromPositive);

  // Then just pipe them to a single unique stream and return it
  var aggregate = new Combine(streams);
  var uniqueStream = unique(ourOpt.uniqueBy);

  return pumpify.obj(aggregate, uniqueStream);

  function streamFromPositive(positive) {
    var negativeGlobs = negatives
      .filter(indexGreaterThan(positive.index))
      .map(toGlob)
      .concat(ignore);
    return new GlobStream(positive.glob, negativeGlobs, ourOpt);
  }
}

function indexGreaterThan(index) {
  return function(obj) {
    return obj.index > index;
  };
}

function toGlob(obj) {
  return obj.glob;
}

module.exports = globStream;
