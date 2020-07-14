"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const Resolver = require('../Resolver');

const fs = require('@parcel/fs');

const os = require('os');

const IMPORT_RE = /^# *import +['"](.*)['"] *;? *$/;

class GraphqlAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
    this.gqlMap = new Map();
    this.gqlResolver = new Resolver(Object.assign({}, this.options, {
      extensions: ['.gql', '.graphql']
    }));
  }

  traverseImports(name, code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.gqlMap.set(name, code);

      yield Promise.all(code.split(/\r\n?|\n/).map(line => line.match(IMPORT_RE)).filter(match => !!match).map(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(function* ([, importName]) {
          let _ref2 = yield _this.gqlResolver.resolve(importName, name),
              resolved = _ref2.path;

          if (_this.gqlMap.has(resolved)) {
            return;
          }

          let code = yield fs.readFile(resolved, 'utf8');
          yield _this.traverseImports(resolved, code);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()));
    })();
  }

  collectDependencies() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.gqlMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let _step$value = (0, _slicedToArray2.default)(_step.value, 1),
            path = _step$value[0];

        this.addDependency(path, {
          includedInParent: true
        });
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
  }

  parse(code) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let gql = yield localRequire('graphql-tag', _this2.name);
      yield _this2.traverseImports(_this2.name, code);
      const allCodes = [..._this2.gqlMap.values()].join(os.EOL);
      return gql(allCodes);
    })();
  }

  generate() {
    return `module.exports=${JSON.stringify(this.ast, null, 2)};`;
  }

}

module.exports = GraphqlAsset;