import fs from 'fs';
import glob from 'glob';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;

  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];

    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  } // if the path is allowed to go above the root, restore leading ..s


  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
} // Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.


var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

var splitPath = function (filename) {
  return splitPathRe.exec(filename).slice(1);
}; // path.resolve([from ...], to)
// posix version


function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : '/'; // Skip empty and invalid entries

    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  } // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)
  // Normalize the path


  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');
  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}
// posix version

function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/'; // Normalize the path

  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }

  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}

function isAbsolute(path) {
  return path.charAt(0) === '/';
} // posix version

function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }

    return p;
  }).join('/'));
} // path.relative(from, to)
// posix version

function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;

    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;

    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;

  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];

  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join('/');
}
var sep = '/';
var delimiter = ':';
function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}
function basename(path, ext) {
  var f = splitPath(path)[2]; // TODO: make this comparison case-insensitive on windows?

  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }

  return f;
}
function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }

  return res;
} // String.prototype.substr - negative index don't work in IE8


var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};

var DefaultExtractor =
/*#__PURE__*/
function () {
  function DefaultExtractor() {
    _classCallCheck(this, DefaultExtractor);
  }

  _createClass(DefaultExtractor, null, [{
    key: "extract",
    value: function extract(content) {
      return content.match(/[A-Za-z0-9_-]+/g) || [];
    }
  }]);

  return DefaultExtractor;
}();

//      
var defaultOptions = {
  css: [],
  content: [],
  defaultExtractor: DefaultExtractor,
  extractors: [],
  whitelist: [],
  output: undefined,
  stdout: false,
  keyframes: false,
  fontFace: false,
  rejected: false
};

var IGNORE_ANNOTATION_CURRENT = 'purgecss ignore current';
var IGNORE_ANNOTATION_NEXT = 'purgecss ignore';
var IGNORE_ANNOTATION_START = 'purgecss start ignore';
var IGNORE_ANNOTATION_END = 'purgecss end ignore';
var CONFIG_FILENAME = 'purgecss.config.js'; // Error Message

var ERROR_CONFIG_FILE_LOADING = 'Error loading the config file';
var ERROR_MISSING_CONTENT = 'No content provided.';
var ERROR_MISSING_CSS = 'No css provided.';
var ERROR_EXTRACTER_FAILED = 'The extractor has failed to extract the selectors.';
var ERROR_OPTIONS_TYPE = 'Error Type Options: expected an object';
var ERROR_OUTPUT_TYPE = 'Error Type option output: expected a string';
var ERROR_EXTRACTERS_TYPE = 'Error Type option extractors: expected an array';
var ERROR_WHITELIST_TYPE = 'Error Type option whitelist: expected an array';
var ERROR_WHITELIST_PATTERNS_TYPE = 'Error Type option whitelistPatterns: expected an array';
var ERROR_STDOUT_TYPE = 'Error Type option stdout: expected a boolean';

var CSS_WHITELIST = ['*', '::-webkit-scrollbar', '::selection', ':root', '::before', '::after'];

var SELECTOR_STANDARD_TYPES = ['class', 'id', 'universal', 'pseudo'];

var IS_NTH = /^:nth-/;

var Purgecss =
/*#__PURE__*/
function () {
  function Purgecss(options) {
    _classCallCheck(this, Purgecss);

    _defineProperty(this, "atRules", {
      keyframes: [],
      fontFace: []
    });

    _defineProperty(this, "usedAnimations", new Set());

    _defineProperty(this, "usedFontFaces", new Set());

    _defineProperty(this, "selectorsRemoved", new Set());

    _defineProperty(this, "ignore", false);

    if (typeof options === 'string' || typeof options === 'undefined') options = this.loadConfigFile(options);
    this.checkOptions(options);
    this.options = Object.assign({}, defaultOptions, options);
  }
  /**
   * Load the configuration file from the path
   * @param {string} configFile Path of the config file
   */


  _createClass(Purgecss, [{
    key: "loadConfigFile",
    value: function loadConfigFile(configFile) {
      var pathConfig = typeof configFile === 'undefined' ? CONFIG_FILENAME : configFile;
      var options;

      try {
        var t = path.join(process.cwd(), pathConfig);
        options = require(t);
      } catch (e) {
        throw new Error(ERROR_CONFIG_FILE_LOADING + e.message);
      }

      return options;
    }
    /**
     * Verify that the purgecss options provided are valid
     * @param {object} options Purgecss options
     */

  }, {
    key: "checkOptions",
    value: function checkOptions(options) {
      if (_typeof(options) !== 'object') throw new TypeError(ERROR_OPTIONS_TYPE);
      if (!options.content || !options.content.length) throw new Error(ERROR_MISSING_CONTENT);
      if (!options.css || !options.css.length) throw new Error(ERROR_MISSING_CSS);
      if (options.output && typeof options.output !== 'string') throw new TypeError(ERROR_OUTPUT_TYPE);
      if (options.extractors && !Array.isArray(options.extractors)) throw new TypeError(ERROR_EXTRACTERS_TYPE);
      if (options.whitelist && !Array.isArray(options.whitelist)) throw new TypeError(ERROR_WHITELIST_TYPE);
      if (options.stdout && typeof options.stdout !== 'boolean') throw new TypeError(ERROR_STDOUT_TYPE);
      if (options.whitelistPatterns && !Array.isArray(options.whitelistPatterns)) throw new TypeError(ERROR_WHITELIST_PATTERNS_TYPE);
    }
    /**
     * Main function that purge the css file
     */

  }, {
    key: "purge",
    value: function purge() {
      // Get selectors from content files
      var _this$options = this.options,
          content = _this$options.content,
          extractors = _this$options.extractors,
          css = _this$options.css;
      var fileFormatContents = content.filter(function (o) {
        return typeof o === 'string';
      });
      var rawFormatContents = content.filter(function (o) {
        return _typeof(o) === 'object';
      });
      var cssFileSelectors = this.extractFileSelector(fileFormatContents, extractors);
      var cssRawSelectors = this.extractRawSelector(rawFormatContents, extractors); // Get css selectors and remove unused ones

      return this.getCssContents(css, new Set([].concat(_toConsumableArray(cssFileSelectors), _toConsumableArray(cssRawSelectors))));
    }
    /**
     * Get the content of the css files, or return the raw content
     * @param {array} cssOptions  Array of css options, files and raw
     * @param {Set} cssSelectors Set of all extracted css selectors
     */

  }, {
    key: "getCssContents",
    value: function getCssContents(cssOptions, cssSelectors) {
      var sources = []; // resolve any globs and flatten again

      cssOptions = cssOptions.map(function (option) {
        return typeof option === 'string' ? glob.sync(option) : option;
      });
      cssOptions = [].concat.apply([], cssOptions);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = cssOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;
          var file = null;
          var rejected = null;
          var cssContent = '';

          if (typeof option === 'string') {
            file = option;
            cssContent = this.options.stdin ? file : fs.readFileSync(file, 'utf8');
          } else {
            cssContent = option.raw;
          }

          this.root = postcss.parse(cssContent); // purge selectors

          this.getSelectorsCss(cssSelectors); // purge keyframes

          if (this.options.keyframes) this.removeUnusedKeyframes(); // purge font face

          if (this.options.fontFace) this.removeUnusedFontFaces();
          var purgeResult = {
            file: file,
            css: this.root.toString(),
            rejected: rejected
          };

          if (this.options.rejected) {
            rejected = Array.from(this.selectorsRemoved);
            this.selectorsRemoved.clear();
          }

          purgeResult.rejected = rejected;
          sources.push(purgeResult);
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

      return sources;
    }
    /**
     * Remove Keyframes that were never used
     */

  }, {
    key: "removeUnusedKeyframes",
    value: function removeUnusedKeyframes() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.atRules.keyframes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;
          var nodeName = node.params;
          var used = this.usedAnimations.has(nodeName);

          if (!used) {
            node.remove();
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * Remove Font-Faces that were never used
     */

  }, {
    key: "removeUnusedFontFaces",
    value: function removeUnusedFontFaces() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.atRules.fontFace[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _step3.value,
              node = _step3$value.node,
              name = _step3$value.name;
          var used = this.usedFontFaces.has(name);

          if (!used) {
            node.remove();
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    /**
     * Strips quotes at the end and at the end of a string
     * @param {string} value the string to be stripped
     */

  }, {
    key: "stripQuotes",
    value: function stripQuotes(value) {
      return value.replace(/(^["'])|(["']$)/g, '');
    }
    /**
     * Extract the selectors present in the passed string using a purgecss extractor
     * @param {array} content Array of content
     * @param {array} extractors Array of extractors
     */

  }, {
    key: "extractRawSelector",
    value: function extractRawSelector(content, extractors) {
      var selectors = new Set();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = content[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _step4.value,
              raw = _step4$value.raw,
              extension = _step4$value.extension;
          var extractor = this.getFileExtractor(".".concat(extension), extractors);
          selectors = new Set([].concat(_toConsumableArray(selectors), _toConsumableArray(this.extractSelectors(raw, extractor))));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return selectors;
    }
    /**
     * Extract the selectors present in the files using a purgecss extractor
     * @param {array} files Array of files path or glob pattern
     * @param {array} extractors Array of extractors
     */

  }, {
    key: "extractFileSelector",
    value: function extractFileSelector(files, extractors) {
      var selectors = new Set();
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = files[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var globfile = _step5.value;
          var filesnames = [];

          if (fs.existsSync(globfile)) {
            filesnames.push(globfile);
          } else {
            filesnames = glob.sync(globfile);
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = filesnames[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var file = _step6.value;
              var content = fs.readFileSync(file, 'utf8');
              var extractor = this.getFileExtractor(file, extractors);
              selectors = new Set([].concat(_toConsumableArray(selectors), _toConsumableArray(this.extractSelectors(content, extractor))));
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return selectors;
    }
    /**
     * Get the extractor corresponding to the extension file
     * @param {string} filename Name of the file
     * @param {array} extractors Array of extractors definition objects
     */

  }, {
    key: "getFileExtractor",
    value: function getFileExtractor(filename) {
      var extractors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (!extractors.length) return this.options.defaultExtractor;
      var extractorObj = extractors.find(function (extractor) {
        return extractor.extensions.find(function (ext) {
          return filename.endsWith(ext);
        });
      }) || {
        extractor: this.options.defaultExtractor
      };
      return extractorObj.extractor;
    }
    /**
     * Use the extract function of the extractor to get the list of selectors
     * @param {string} content Content (e.g: html file)
     * @param {object} extractor Purgecss extractor use to extract the selector
     */

  }, {
    key: "extractSelectors",
    value: function extractSelectors(content, extractor) {
      var selectors = new Set();
      var arraySelector = typeof extractor.extract === 'undefined' ? extractor(content) : extractor.extract(content);

      if (arraySelector === null) {
        throw new Error(ERROR_EXTRACTER_FAILED);
      }

      arraySelector.forEach(function (selector) {
        selectors.add(selector);
      }); // Remove empty string

      selectors.delete('');
      return selectors;
    }
    /**
     * Use postcss to walk through the css ast and remove unused css
     * @param {*} selectors selectors used in content files
     */

  }, {
    key: "getSelectorsCss",
    value: function getSelectorsCss(selectors) {
      var _this = this;

      this.root.walk(function (node) {
        if (node.type === 'rule') {
          return _this.evaluateRule(node, selectors);
        }

        if (node.type === 'atrule') {
          return _this.evaluateAtRule(node);
        }

        if (node.type === 'comment') {
          if (_this.isIgnoreAnnotation(node, 'start')) {
            _this.ignore = true; // remove ignore annotation

            node.remove();
          } else if (_this.isIgnoreAnnotation(node, 'end')) {
            _this.ignore = false; // remove ignore annotation

            node.remove();
          }
        }
      });
    }
    /**
     * Evaluate css selector and decide if it should be removed or not
     * @param {AST} node postcss ast node
     * @param {Set} selectors selectors used in content files
     */

  }, {
    key: "evaluateRule",
    value: function evaluateRule(node, selectors) {
      var _this2 = this;

      var annotation = node.prev();
      if (this.ignore) return;

      if (typeof annotation !== 'undefined' && annotation.type === 'comment' && this.isIgnoreAnnotation(annotation, 'next')) {
        annotation.remove();
        return;
      }

      if (node.parent && node.parent.type === 'atrule' && node.parent.name === 'keyframes') {
        return;
      }

      if (this.hasIgnoreAnnotation(node)) {
        return;
      }

      var keepSelector = true;
      node.selector = selectorParser(function (selectorsParsed) {
        selectorsParsed.walk(function (selector) {
          var selectorsInRule = [];

          if (selector.type === 'selector') {
            // if inside :not pseudo class, ignore
            if (selector.parent && selector.parent.value === ':not' && selector.parent.type === 'pseudo') {
              return;
            }

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = selector.nodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _step7$value = _step7.value,
                    type = _step7$value.type,
                    value = _step7$value.value;

                if (SELECTOR_STANDARD_TYPES.includes(type) && typeof value !== 'undefined') {
                  selectorsInRule.push(value);
                } else if (type === 'tag' && !( // skip everything inside :nth-* pseudo selectors
                selector.parent && selector.parent.type === 'pseudo' && IS_NTH.test(selector.parent.value))) {
                  selectorsInRule.push(value);
                }
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            keepSelector = _this2.shouldKeepSelector(selectors, selectorsInRule);

            if (!keepSelector) {
              if (_this2.options.rejected) _this2.selectorsRemoved.add(selector.toString());
              selector.remove();
            }
          }
        });
      }).processSync(node.selector); // loop declarations

      if (keepSelector) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = node.nodes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _step8$value = _step8.value,
                prop = _step8$value.prop,
                value = _step8$value.value;

            if (this.options.keyframes) {
              if (prop === 'animation' || prop === 'animation-name') {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                  for (var _iterator9 = value.split(/[\s,]+/)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var word = _step9.value;
                    this.usedAnimations.add(word);
                  }
                } catch (err) {
                  _didIteratorError9 = true;
                  _iteratorError9 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                      _iterator9.return();
                    }
                  } finally {
                    if (_didIteratorError9) {
                      throw _iteratorError9;
                    }
                  }
                }
              }
            }

            if (this.options.fontFace) {
              if (prop === 'font-family') {
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                  for (var _iterator10 = value.split(',')[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var fontName = _step10.value;
                    var cleanedFontFace = this.stripQuotes(fontName.trim());
                    this.usedFontFaces.add(cleanedFontFace);
                  }
                } catch (err) {
                  _didIteratorError10 = true;
                  _iteratorError10 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
                      _iterator10.return();
                    }
                  } finally {
                    if (_didIteratorError10) {
                      throw _iteratorError10;
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }

      var parent = node.parent; // Remove empty rules

      if (!node.selector) node.remove();
      if (this.isRuleEmpty(parent)) parent.remove();
    }
    /**
     * Evaluate at-rule and register it for future reference
     * @param {AST} node postcss ast node
     */

  }, {
    key: "evaluateAtRule",
    value: function evaluateAtRule(node) {
      if (this.options.keyframes && node.name.endsWith('keyframes')) {
        this.atRules.keyframes.push(node);
        return;
      }

      if (this.options.fontFace && node.name === 'font-face') {
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = node.nodes[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var _step11$value = _step11.value,
                prop = _step11$value.prop,
                value = _step11$value.value;

            if (prop === 'font-family') {
              this.atRules.fontFace.push({
                name: this.stripQuotes(value),
                node: node
              });
            }
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return;
      }
    }
    /**
     * Check if the node is a css comment to ignore the selector rule
     * @param {object} node Node of postcss abstract syntax tree
     * @param {string} type Type of css comment (next, start, end)
     */

  }, {
    key: "isIgnoreAnnotation",
    value: function isIgnoreAnnotation(node, type) {
      if (node && node.type === 'comment') {
        switch (type) {
          case 'next':
            return node.text.includes(IGNORE_ANNOTATION_NEXT);

          case 'start':
            return node.text.includes(IGNORE_ANNOTATION_START);

          case 'end':
            return node.text.includes(IGNORE_ANNOTATION_END);
        }
      }

      return false;
    }
    /**
     * Check if the node has a css comment to ignore current selector rule
     * @param {object} rule Node of postcss abstract syntax tree
     */

  }, {
    key: "hasIgnoreAnnotation",
    value: function hasIgnoreAnnotation(rule) {
      var found = false;
      rule.walkComments(function (node) {
        if (node && node.type === 'comment' && node.text.includes(IGNORE_ANNOTATION_CURRENT)) {
          found = true;
          node.remove();
        }
      });
      return found;
    }
    /**
     * Check if the node correspond to an empty css rule
     * @param {object} node Node of postcss abstract syntax tree
     */

  }, {
    key: "isRuleEmpty",
    value: function isRuleEmpty(node) {
      if (node.type === 'decl' && !node.value || node.type === 'rule' && !node.selector || node.nodes && !node.nodes.length || node.type === 'atrule' && (!node.nodes && !node.params || !node.params && !node.nodes.length)) {
        return true;
      }

      return false;
    }
    /**
     * Determine if the selector should be kept, based on the selectors found in the files
     * @param {Set} selectorsInContent Set of css selectors found in the content files
     * @param {Array} selectorsInRule Array of selectors
     */

  }, {
    key: "shouldKeepSelector",
    value: function shouldKeepSelector(selectorsInContent, selectorsInRule) {
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = selectorsInRule[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var selector = _step12.value;
          // pseudo class
          var unescapedSelector = selector.replace(/\\/g, '');

          if (unescapedSelector.startsWith(':')) {
            continue;
          } // If the selector is whitelisted with children keep, simply
          // returns true to keep all children selectors


          if (this.isSelectorWhitelistedChildren(unescapedSelector)) {
            return true;
          }

          if (!(selectorsInContent.has(unescapedSelector) || CSS_WHITELIST.includes(unescapedSelector) || this.isSelectorWhitelisted(unescapedSelector))) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      return true;
    }
    /**
     * Check if the selector is whitelisted by the options whitelist or whitelistPatterns
     * @param {string} selector css selector
     */

  }, {
    key: "isSelectorWhitelisted",
    value: function isSelectorWhitelisted(selector) {
      return !!(CSS_WHITELIST.includes(selector) || this.options.whitelist && this.options.whitelist.some(function (v) {
        return v === selector;
      }) || this.options.whitelistPatterns && this.options.whitelistPatterns.some(function (v) {
        return v.test(selector);
      }));
    }
    /**
     * Check if the selector is whitelisted by the whitelistPatternsChildren
     * options element
     *
     * @param {string} selector
     */

  }, {
    key: "isSelectorWhitelistedChildren",
    value: function isSelectorWhitelistedChildren(selector) {
      return !!(this.options.whitelistPatternsChildren && this.options.whitelistPatternsChildren.some(function (v) {
        return v.test(selector);
      }));
    }
  }]);

  return Purgecss;
}();

export default Purgecss;
