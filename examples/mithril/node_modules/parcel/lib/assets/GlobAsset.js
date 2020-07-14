"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const micromatch = require('micromatch');

const path = require('path');

const _require = require('../utils/glob'),
      glob = _require.glob;

class GlobAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = null; // allows this asset to be included in any type bundle
  }

  load() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let regularExpressionSafeName = _this.name;
      if (process.platform === 'win32') regularExpressionSafeName = regularExpressionSafeName.replace(/\\/g, '/');
      let files = yield glob(regularExpressionSafeName, {
        onlyFiles: true
      });
      let re = micromatch.makeRe(regularExpressionSafeName, {
        capture: true
      });
      let matches = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let file = _step.value;
          let match = file.match(re);
          let parts = match.slice(1).filter(Boolean).reduce((a, p) => a.concat(p.split('/')), []);
          let relative = './' + path.relative(path.dirname(_this.name), file.normalize('NFC'));
          set(matches, parts, relative);

          _this.addDependency(relative);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return matches;
    })();
  }

  generate() {
    return [{
      type: 'js',
      value: 'module.exports = ' + generate(this.contents) + ';'
    }];
  }

}

function generate(matches, indent = '') {
  if (typeof matches === 'string') {
    return `require(${JSON.stringify(matches)})`;
  }

  let res = indent + '{';
  let first = true;

  for (let key in matches) {
    if (!first) {
      res += ',';
    }

    res += `\n${indent}  ${JSON.stringify(key)}: ${generate(matches[key], indent + '  ')}`;
    first = false;
  }

  res += '\n' + indent + '}';
  return res;
}

function set(obj, path, value) {
  for (let i = 0; i < path.length - 1; i++) {
    let part = path[i];

    if (obj[part] == null) {
      obj[part] = {};
    }

    obj = obj[part];
  }

  obj[path[path.length - 1]] = value;
}

module.exports = GlobAsset;