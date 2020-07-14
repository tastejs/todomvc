"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const path = require('path');

const _require = require('@parcel/utils'),
      promisify = _require.promisify;

const Resolver = require('../Resolver');

class GLSLAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  parse() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const glslifyDeps = yield localRequire('glslify-deps', _this.name); // Use the Parcel resolver rather than the default glslify one.
      // This adds support for parcel features like aliases, and tilde paths.

      const resolver = new Resolver({
        extensions: ['.glsl', '.vert', '.frag'],
        rootDir: _this.options.rootDir
      }); // Parse and collect dependencies with glslify-deps

      let cwd = path.dirname(_this.name);
      let depper = glslifyDeps({
        cwd,
        resolve: function () {
          var _resolve = (0, _asyncToGenerator2.default)(function* (target, opts, next) {
            try {
              let res = yield resolver.resolve(target, path.join(opts.basedir, 'index'));
              next(null, res.path);
            } catch (err) {
              next(err);
            }
          });

          function resolve(_x, _x2, _x3) {
            return _resolve.apply(this, arguments);
          }

          return resolve;
        }()
      });
      return promisify(depper.inline.bind(depper))(_this.contents, cwd);
    })();
  }

  collectDependencies() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.ast[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let dep = _step.value;

        if (!dep.entry) {
          this.addDependency(dep.file, {
            includedInParent: true
          });
        }
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

  generate() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Generate the bundled glsl file
      const glslifyBundle = yield localRequire('glslify-bundle', _this2.name);
      let glsl = glslifyBundle(_this2.ast);
      return `module.exports=${JSON.stringify(glsl)};`;
    })();
  }

}

module.exports = GLSLAsset;