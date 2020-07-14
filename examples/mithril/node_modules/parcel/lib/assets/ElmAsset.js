"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const commandExists = require('command-exists');

const localRequire = require('../utils/localRequire');

const _require = require('terser'),
      minify = _require.minify;

const path = require('path');

const spawn = require('cross-spawn');

class ElmAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  parse() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let options = {
        cwd: path.dirname(_this.name)
      }; // If elm is not installed globally, install it locally.

      try {
        yield commandExists('elm');
      } catch (err) {
        yield localRequire('elm', _this.name);
        options.pathToElm = path.join(path.dirname(require.resolve('elm')), 'bin', 'elm');
      }

      _this.elm = yield localRequire('node-elm-compiler', _this.name); // Ensure that an elm.json file exists, and initialize one if not.

      let elmConfig = yield _this.getConfig(['elm.json'], {
        load: false
      });

      if (!elmConfig) {
        yield _this.createElmConfig(options); // Ensure we are watching elm.json for changes

        yield _this.getConfig(['elm.json'], {
          load: false
        });
      }

      options.debug = !_this.options.production;

      if (_this.options.minify) {
        options.optimize = true;
      }

      _this.elmOpts = options;
    })();
  }

  collectDependencies() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let dependencies = yield _this2.elm.findAllDependencies(_this2.name);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let dependency = _step.value;

          _this2.addDependency(dependency, {
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
    })();
  }

  createElmConfig(options) {
    return (0, _asyncToGenerator2.default)(function* () {
      let cp = spawn(options.pathToElm || 'elm', ['init']);
      cp.stdin.write('y\n');
      return new Promise((resolve, reject) => {
        cp.on('error', reject);
        cp.on('close', function (code) {
          if (code !== 0) {
            return reject(new Error('elm init failed.'));
          }

          return resolve();
        });
      });
    })();
  }

  generate() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let compiled = yield _this3.elm.compileToString(_this3.name, _this3.elmOpts);
      _this3.contents = compiled.toString();

      if (_this3.options.hmr) {
        let _ref = yield localRequire('elm-hot', _this3.name),
            inject = _ref.inject;

        _this3.contents = inject(_this3.contents);
      }

      let output = _this3.contents;

      if (_this3.options.minify) {
        output = pack(output);
      }

      return {
        [_this3.type]: output
      }; // Recommended minification
      // Based on:
      // - http://elm-lang.org/0.19.0/optimize

      function pack(source) {
        let options = {
          compress: {
            keep_fargs: false,
            passes: 2,
            pure_funcs: ['F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true
          },
          mangle: true,
          rename: false
        };
        let result = minify(source, options);

        if (result.error) {
          throw result.error;
        }

        return result.code;
      }
    })();
  }

  generateErrorMessage(err) {
    // The generated stack is not useful, but other code may
    // expect it and try to print it, so make it an empty string.
    err.stack = '';
    return err;
  }

}

module.exports = ElmAsset;