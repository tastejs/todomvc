'use strict';

var SemverRange = require('sver-compat').SemverRange;

function findRange(version, ranges) {
  ranges = ranges || [];

  function matches(range) {
    return SemverRange.match(range, version, true);
  }

  var validRanges = ranges.filter(matches);

  var sortedRanges = validRanges.sort(SemverRange.compare);

  return sortedRanges.pop() || null;
}

module.exports = findRange;
