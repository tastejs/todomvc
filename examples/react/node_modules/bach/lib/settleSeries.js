'use strict';

var initial = require('array-initial');
var last = require('array-last');
var asyncSettle = require('async-settle');
var nowAndLater = require('now-and-later');

var helpers = require('./helpers');

function iterator(fn, key, cb) {
  return asyncSettle(fn, cb);
}

function buildSettleSeries() {
  var args = helpers.verifyArguments(arguments);

  var extensions = helpers.getExtensions(last(args));

  if (extensions) {
    args = initial(args);
  }

  function settleSeries(done) {
    var onSettled = helpers.onSettled(done);
    nowAndLater.mapSeries(args, iterator, extensions, onSettled);
  }

  return settleSeries;
}

module.exports = buildSettleSeries;
