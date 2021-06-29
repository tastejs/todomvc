'use strict';

var shortSemverRegEx = /^([~\^])?(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?$/;
var semverRegEx = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-z-]+(?:\.[\da-z-]+)*))?(\+[\da-z-]+)?$/i;
exports.semverRegEx = semverRegEx;
exports.shortSemverRegEx = shortSemverRegEx;

var Symbol = require('es6-symbol');

var MAJOR = Symbol('major');
var MINOR = Symbol('minor');
var PATCH = Symbol('patch');
var PRE = Symbol('pre');
var BUILD = Symbol('build');
var TAG = Symbol('tag');

var numRegEx = /^\d+$/;
function Semver(version) {
  var semver = version.match(semverRegEx);
  if (!semver) {
    this[TAG] = version;
    return;
  }
  this[MAJOR] = parseInt(semver[1], 10);
  this[MINOR] = parseInt(semver[2], 10);
  this[PATCH] = parseInt(semver[3], 10);
  this[PRE] = semver[4] && semver[4].split('.');
  this[BUILD] = semver[5];
}
Object.defineProperty(Semver.prototype, 'major', {
  get: function major () {
    return this[MAJOR];
  }
});
Object.defineProperty(Semver.prototype, 'minor', {
  get: function minor () {
    return this[MINOR];
  }
});
Object.defineProperty(Semver.prototype, 'patch', {
  get: function patch () {
    return this[PATCH];
  }
});
Object.defineProperty(Semver.prototype, 'pre', {
  get: function pre () {
    return this[PRE];
  }
});
Object.defineProperty(Semver.prototype, 'build', {
  get: function build () {
    return this[BUILD];
  }
});
Object.defineProperty(Semver.prototype, 'tag', {
  get: function tag () {
    return this[TAG];
  }
});

Semver.prototype.gt = function gt(version) {
  return Semver.compare(this, version) === 1;
}
Semver.prototype.lt = function lt (version) {
  return Semver.compare(this, version) === -1;
}
Semver.prototype.eq = function eq (version) {
  if (!(version instanceof Semver))
    version = new Semver(version);

  if (this[TAG] && version[TAG])
    return this[TAG] === version[TAG];
  if (this[TAG] || version[TAG])
    return false;
  if (this[MAJOR] !== version[MAJOR])
    return false;
  if (this[MINOR] !== version[MINOR])
    return false;
  if (this[PATCH] !== version[PATCH])
    return false;
  if (this[PRE] === undefined && version[PRE] === undefined)
    return true;
  if (this[PRE] === undefined || version[PRE] === undefined)
    return false;
  if (this[PRE].length !== version[PRE].length)
    return false;
  for (var i = 0; i < this[PRE].length; i++) {
    if (this[PRE][i] !== version[PRE][i])
      return false;
  }
  return this[BUILD] === version[BUILD];
}
Semver.prototype.matches = function matches (range, unstable) {
  unstable = unstable || false;
  if (!(range instanceof SemverRange))
    range = new SemverRange(range);
  return range.has(this, unstable);
}
Semver.prototype.toString = function toString () {
  if (this[TAG])
    return this[TAG];
  return this[MAJOR] + '.' + this[MINOR] + '.' + this[PATCH] + (this[PRE] ? '-' + this[PRE].join('.') : '') + (this[BUILD] ? this[BUILD] : '');
}
Semver.isValid = function isValid (version) {
  var semver = version.match(semverRegEx);
  return semver && semver[2] !== undefined && semver[3] !== undefined;
}
Semver.compare = function compare (v1, v2) {
  if (!(v1 instanceof Semver))
    v1 = new Semver(v1);
  if (!(v2 instanceof Semver))
    v2 = new Semver(v2);

  // not semvers - tags have equal precedence
  if (v1[TAG] && v2[TAG])
    return 0;
  // semver beats tag version
  if (v1[TAG])
    return -1;
  if (v2[TAG])
    return 1;
  // compare version numbers
  if (v1[MAJOR] !== v2[MAJOR])
    return v1[MAJOR] > v2[MAJOR] ? 1 : -1;
  if (v1[MINOR] !== v2[MINOR])
    return v1[MINOR] > v2[MINOR] ? 1 : -1;
  if (v1[PATCH] !== v2[PATCH])
    return v1[PATCH] > v2[PATCH] ? 1 : -1;
  if (!v1[PRE] && !v2[PRE])
    return 0;
  if (!v1[PRE])
    return 1;
  if (!v2[PRE])
    return -1;
  // prerelease comparison
  for (var i = 0, l = Math.min(v1[PRE].length, v2[PRE].length); i < l; i++) {
    if (v1[PRE][i] !== v2[PRE][i]) {
      var isNum1 = v1[PRE][i].match(numRegEx);
      var isNum2 = v2[PRE][i].match(numRegEx);
      // numeric has lower precedence
      if (isNum1 && !isNum2)
        return -1;
      if (isNum2 && !isNum1)
        return 1;
      // compare parts
      if (isNum1 && isNum2)
        return parseInt(v1[PRE][i], 10) > parseInt(v2[PRE][i], 10) ? 1 : -1;
      else
        return v1[PRE][i] > v2[PRE][i] ? 1 : -1;
    }
  }
  if (v1[PRE].length === v2[PRE].length)
    return 0;
  // more pre-release fields win if equal
  return v1[PRE].length > v2[PRE].length ? 1 : -1;
}
exports.Semver = Semver;

var WILDCARD_RANGE = 0;
var MAJOR_RANGE = 1;
var STABLE_RANGE = 2;
var EXACT_RANGE = 3;

var TYPE = Symbol('type');
var VERSION = Symbol('version');

function SemverRange(versionRange) {
  if (versionRange === '*' || versionRange === '') {
    this[TYPE] = WILDCARD_RANGE;
    return;
  }
  var shortSemver = versionRange.match(shortSemverRegEx);
  if (shortSemver) {
    if (shortSemver[1])
      versionRange = versionRange.substr(1);
    if (shortSemver[3] === undefined) {
      // ^, ~ mean the same thing for a single major
      this[VERSION] = new Semver(versionRange + '.0.0');
      this[TYPE] = MAJOR_RANGE;
    }
    else {
      this[VERSION] = new Semver(versionRange + '.0');
      // ^ only becomes major range for major > 0
      if (shortSemver[1] === '^' && shortSemver[2] !== '0')
        this[TYPE] = MAJOR_RANGE;
      else
        this[TYPE] = STABLE_RANGE;
    }
      // empty pre array === support prerelease ranges
    this[VERSION][PRE] = this[VERSION][PRE] || [];
  }
  else if (versionRange[0] === '^') {
    this[VERSION] = new Semver(versionRange.substr(1));
    if (this[VERSION][MAJOR] === 0) {
      if (this[VERSION][MINOR] === 0)
        this[TYPE] = EXACT_RANGE;
      else
        this[TYPE] = STABLE_RANGE;
    }
    else {
      this[TYPE] = MAJOR_RANGE;
    }
  }
  else if (versionRange[0] === '~') {
    this[VERSION] = new Semver(versionRange.substr(1));
    this[TYPE] = STABLE_RANGE;
  }
  else {
    this[VERSION] = new Semver(versionRange);
    this[TYPE] = EXACT_RANGE;
  }
  if (this[VERSION][TAG] && this[TYPE] !== EXACT_RANGE)
    this[TYPE] = EXACT_RANGE;
}
Object.defineProperty(SemverRange.prototype, 'isExact', {
  get: function isExact () {
    return this[TYPE] === EXACT_RANGE;
  }
});
Object.defineProperty(SemverRange.prototype, 'isStable', {
  get: function isStable () {
    return this[TYPE] === STABLE_RANGE;
  }
});
Object.defineProperty(SemverRange.prototype, 'isMajor', {
  get: function isMajor () {
    return this[TYPE] === MAJOR_RANGE;
  }
});
Object.defineProperty(SemverRange.prototype, 'isWildcard', {
  get: function isWildcard () {
    return this[TYPE] === WILDCARD_RANGE;
  }
});
Object.defineProperty(SemverRange.prototype, 'type', {
  get: function type () {
    switch (this[TYPE]) {
      case WILDCARD_RANGE:
        return 'wildcard';
      case MAJOR_RANGE:
        return 'major';
      case STABLE_RANGE:
        return 'stable';
      case EXACT_RANGE:
        return 'exact';
    }
  }
});
Object.defineProperty(SemverRange.prototype, 'version', {
  get: function version () {
    return this[VERSION];
  }
});

SemverRange.prototype.gt = function gt (range) {
  return SemverRange.compare(this, range) === 1;
}
SemverRange.prototype.lt = function lt (range) {
  return SemverRange.compare(this, range) === -1;
}
SemverRange.prototype.eq = function eq (range) {
  return SemverRange.compare(this, range) === 0;
}
SemverRange.prototype.has = function has (version, unstable) {
  unstable = unstable || false;
  if (!(version instanceof Semver))
    version = new Semver(version);
  if (this[TYPE] === WILDCARD_RANGE)
    return true;
  if (this[TYPE] === EXACT_RANGE)
    return this[VERSION].eq(version);
  if (version[TAG])
    return false;
  if (version.lt(this[VERSION]))
    return false;
  if (version[PRE] && !unstable)
    return this[VERSION][MAJOR] === version[MAJOR] && this[VERSION][MINOR] === version[MINOR] && this[VERSION][PATCH] === version[PATCH];
  if (this[TYPE] === MAJOR_RANGE)
    return this[VERSION][MAJOR] === version[MAJOR];
  return this[VERSION][MAJOR] === version[MAJOR] && this[VERSION][MINOR] === version[MINOR];
}
SemverRange.prototype.contains = function contains (range) {
  if (!(range instanceof SemverRange))
    range = new SemverRange(range);
  if (this[TYPE] === WILDCARD_RANGE)
    return true;
  if (range[TYPE] === WILDCARD_RANGE)
    return false;
  return range[TYPE] >= this[TYPE] && this.has(range[VERSION], true);
}
SemverRange.prototype.intersect = function intersect (range) {
  if (!(range instanceof SemverRange))
    range = new SemverRange(range);

  if (this[TYPE] === WILDCARD_RANGE && range[TYPE] === WILDCARD_RANGE)
    return this;
  if (this[TYPE] === WILDCARD_RANGE)
    return range;
  if (range[TYPE] === WILDCARD_RANGE)
    return this;

  if (this[TYPE] === EXACT_RANGE)
    return range.has(this[VERSION], true) ? this : undefined;
  if (range[TYPE] === EXACT_RANGE)
    return this.has(range[VERSION], true) ? range : undefined;

  var higherRange, lowerRange, polarity;
  if (range[VERSION].gt(this[VERSION])) {
    higherRange = range;
    lowerRange = this;
    polarity = true;
  }
  else {
    higherRange = this;
    lowerRange = range;
    polarity = false;
  }

  if (!lowerRange.has(higherRange[VERSION], true))
    return;

  if (lowerRange[TYPE] === MAJOR_RANGE)
    return polarity ? range : this;

  var intersection = new SemverRange(higherRange[VERSION].toString());
  intersection[TYPE] = STABLE_RANGE;
  return intersection;
}
SemverRange.prototype.bestMatch = function bestMatch (versions, unstable) {
  unstable = unstable || false;
  var self = this;
  var maxSemver;
  versions.forEach(function(version) {
    if (!(version instanceof Semver))
      version = new Semver(version);
    if (!self.has(version, unstable))
      return;
    if (!unstable && version[PRE]) {
      if (self[TYPE] === WILDCARD_RANGE || !self[VERSION][PRE] || self[VERSION][MAJOR] !== version[MAJOR] ||
          self[VERSION][MINOR] !== version[MINOR] || self[VERSION][PATCH] !== version[PATCH])
        return;
    }
    if (!maxSemver) {
      maxSemver = version;
    }
    else if (Semver.compare(version, maxSemver) === 1) {
      maxSemver = version;
    }
  });
  return maxSemver;
}
SemverRange.prototype.toString = function toString () {
  var version = this[VERSION];
  switch (this[TYPE]) {
    case WILDCARD_RANGE:
      return '*';
    case MAJOR_RANGE:
      if (version[MAJOR] === 0 && version[MINOR] === 0 && version[PATCH] === 0)
         return '0';
      if (version[PRE] && version[PRE].length === 0 && version[PATCH] === 0)
         return '^' + version[MAJOR] + '.' + version[MINOR];
      return '^' + version.toString();
    case STABLE_RANGE:
      if (version[PRE] && version[PRE].length === 0 && version[PATCH] === 0)
        return version[MAJOR] + '.' + version[MINOR];
      return '~' + version.toString();
    case EXACT_RANGE:
      return version.toString();
  }
}
SemverRange.match = function match (range, version, unstable) {
  unstable = unstable || false;
  if (!(version instanceof Semver))
    version = new Semver(version);
  return version.matches(range, unstable);
}
SemverRange.isValid = function isValid (range) {
  var semverRange = new SemverRange(range);
  return semverRange[TYPE] !== EXACT_RANGE || semverRange[VERSION][TAG] === undefined;
}
SemverRange.compare = function compare (r1, r2) {
  if (!(r1 instanceof SemverRange))
    r1 = new SemverRange(r1);
  if (!(r2 instanceof SemverRange))
    r2 = new SemverRange(r2);
  if (r1[TYPE] === WILDCARD_RANGE && r2[TYPE] === WILDCARD_RANGE)
    return 0;
  if (r1[TYPE] === WILDCARD_RANGE)
    return 1;
  if (r2[TYPE] === WILDCARD_RANGE)
    return -1;
  var cmp = Semver.compare(r1[VERSION], r2[VERSION]);
  if (cmp !== 0) {
    return cmp;
  }
  if (r1[TYPE] === r2[TYPE])
    return 0;
  return r1[TYPE] > r2[TYPE] ? 1 : -1;
}
exports.SemverRange = SemverRange;
