var nodeSemver = require('semver');
var sver = require('./sver');
var Semver = sver.Semver;
var SemverRange = sver.SemverRange;
var forOf = require('es6-iterator/for-of');

module.exports = function nodeRangeToSemverRange (range) {
  var parsed = nodeSemver.validRange(range);

  // tag version
  if (!parsed)
    return new SemverRange(range);

  if (parsed === '*')
    return new SemverRange(parsed);

  try {
    var semverRange = new SemverRange(range);
    if (!semverRange.version.tag)
      return semverRange;
  }
  catch (e) {
    if (e.code !== 'ENOTSEMVER')
      throw e;
  }

  var outRange;
  forOf(parsed.split('||'), function(union) {

    // compute the intersection into a lowest upper bound and a highest lower bound
    var upperBound, lowerBound, upperEq, lowerEq;
    forOf(union.split(' '), function(intersection, doBreak) {
      var lt = intersection[0] === '<';
      var gt = intersection[0] === '>';
      if (!lt && !gt) {
        upperBound = intersection;
        upperEq = true;
        return doBreak();
      }
      var eq = intersection[1] === '=';
      if (!gt) {
        var version = new Semver(intersection.substr(1 + eq));
        if (!upperBound || upperBound.gt(version)) {
          upperBound = version;
          upperEq = eq;
        }
      }
      else if (!lt) {
        var eq = intersection[1] === '=';
        var version = new Semver(intersection.substr(1 + eq));
        if (!lowerBound || lowerBound.lt(version)) {
          lowerBound = version;
          lowerEq = eq;
        }
      }
    });

    // if the lower bound is greater than the upper bound then just return the lower bound exactly
    if (lowerBound && upperBound && lowerBound.gt(upperBound)) {
      var curRange = new SemverRange(lowerBound.toString());
      // the largest or highest union range wins
      if (!outRange || !outRange.contains(curRange) && (curRange.gt(outRange) || curRange.contains(outRange)))
        outRange = curRange;
      return;
    }

    // determine the largest semver range satisfying the upper bound
    var upperRange;
    if (upperBound) {
      // if the upper bound has an equality then we return it directly
      if (upperEq) {
        var curRange = new SemverRange(upperBound.toString());
        // the largest or highest union range wins
        if (!outRange || !outRange.contains(curRange) && (curRange.gt(outRange) || curRange.contains(outRange)))
          outRange = curRange;
        return;
      }

      // prerelease ignored in upper bound
      var major = 0, minor = 0, patch = 0, rangeType = '';

      // <2.0.0 -> ^1.0.0
      if (upperBound.patch === 0) {
        if (upperBound.minor === 0) {
          if (upperBound.major > 0) {
            major = upperBound.major - 1;
            rangeType = '^';
          }
        }
        // <1.2.0 -> ~1.1.0
        else {
          major = upperBound.major;
          minor = upperBound.minor - 1;
          rangeType = '~';
        }
      }
      // <1.2.3 -> ~1.2.0
      else {
        major = upperBound.major;
        minor = upperBound.minor;
        patch = 0;
        rangeType = '~';
      }

      if (major === 0 && rangeType === '^')
        upperRange = new SemverRange('0');
      else
        upperRange = new SemverRange(rangeType + major + '.' + minor + '.' + patch);
    }

    // determine the lower range semver range
    var lowerRange;
    if (!lowerEq) {
      if (lowerBound.pre)
        lowerRange = new SemverRange('^' + lowerBound.major + '.' + lowerBound.minor + '.' + lowerBound.patch + '-' + lowerBound.pre.join('.') + '.1');
      else
        lowerRange = new SemverRange('^' + lowerBound.major + '.' + lowerBound.minor + '.' + (lowerBound.patch + 1));
    }
    else {
      lowerRange = new SemverRange('^' + lowerBound.toString());
    }

    // we then intersect the upper semver range with the lower semver range
    // if the intersection is empty, we return the upper range only
    var curRange = upperRange ? lowerRange.intersect(upperRange) || upperRange : lowerRange;

    // the largest or highest union range wins
    if (!outRange || !outRange.contains(curRange) && (curRange.gt(outRange) || curRange.contains(outRange)))
      outRange = curRange;
  });
  return outRange;
}
